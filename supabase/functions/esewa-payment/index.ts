import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// eSewa Merchant Credentials (from environment)
const ESEWA_MERCHANT_ID = Deno.env.get("ESEWA_MERCHANT_ID") || "EPAYTEST";
const ESEWA_SECRET_KEY = Deno.env.get("ESEWA_SECRET_KEY") || "8gBm/:&EnhH.1/q";

// eSewa API URLs
const ESEWA_PAYMENT_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const ESEWA_VERIFY_URL = "https://rc-epay.esewa.com.np/api/epay/transaction/status/";

interface PaymentInitRequest {
  amount: number;
  productId: string;
  productName: string;
  userId: string;
  plan: string;
  successUrl: string;
  failureUrl: string;
}

interface PaymentVerifyRequest {
  transactionCode: string;
  amount: number;
  productId: string;
}

async function generateSignature(message: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(message);
  
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, messageData);
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    if (req.method === "POST" && action === "initiate") {
      // Initiate payment
      const body: PaymentInitRequest = await req.json();
      const { amount, productId, productName, userId, plan, successUrl, failureUrl } = body;

      console.log("Initiating eSewa payment:", { amount, productId, plan, userId });

      // Generate unique transaction UUID
      const transactionUuid = globalThis.crypto.randomUUID();
      
      // Calculate total amount (amount + tax + service charge + delivery charge)
      const totalAmount = amount;
      const taxAmount = 0;
      const serviceCharge = 0;
      const deliveryCharge = 0;

      // Generate signature
      const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_MERCHANT_ID}`;
      const signature = await generateSignature(signatureMessage, ESEWA_SECRET_KEY);

      // Store pending transaction in database
      const { error: insertError } = await supabaseClient
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan: plan,
          status: "pending",
          payment_method: "esewa",
          payment_reference: transactionUuid,
          amount: amount,
          currency: "NPR",
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (insertError) {
        console.error("Error storing subscription:", insertError);
        throw new Error("Failed to create subscription record");
      }

      // Return payment form data
      const paymentData = {
        amount: amount.toString(),
        tax_amount: taxAmount.toString(),
        total_amount: totalAmount.toString(),
        transaction_uuid: transactionUuid,
        product_code: ESEWA_MERCHANT_ID,
        product_service_charge: serviceCharge.toString(),
        product_delivery_charge: deliveryCharge.toString(),
        success_url: successUrl,
        failure_url: failureUrl,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
      };

      console.log("Payment data prepared:", { transactionUuid, totalAmount });

      return new Response(
        JSON.stringify({
          success: true,
          paymentUrl: ESEWA_PAYMENT_URL,
          paymentData,
          transactionUuid,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "POST" && action === "verify") {
      // Verify payment
      const body: PaymentVerifyRequest = await req.json();
      const { transactionCode, amount, productId } = body;

      console.log("Verifying eSewa payment:", { transactionCode, amount, productId });

      // Verify with eSewa API
      const verifyResponse = await fetch(
        `${ESEWA_VERIFY_URL}?product_code=${ESEWA_MERCHANT_ID}&total_amount=${amount}&transaction_uuid=${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const verifyData = await verifyResponse.json();
      console.log("eSewa verification response:", verifyData);

      if (verifyData.status === "COMPLETE") {
        // Update subscription status to active
        const { data: subscription, error: updateError } = await supabaseClient
          .from("subscriptions")
          .update({ 
            status: "active",
            payment_reference: transactionCode 
          })
          .eq("payment_reference", productId)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating subscription:", updateError);
          throw new Error("Failed to activate subscription");
        }

        // Add credits based on plan
        const creditsToAdd = subscription.plan === "pro" ? 5000 : 20000;
        
        await supabaseClient
          .from("user_credits")
          .update({ 
            balance: creditsToAdd,
            total_purchased: creditsToAdd 
          })
          .eq("user_id", subscription.user_id);

        console.log("Subscription activated:", subscription.id);

        return new Response(
          JSON.stringify({
            success: true,
            message: "Payment verified and subscription activated",
            subscription,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } else {
        // Payment failed or pending
        await supabaseClient
          .from("subscriptions")
          .update({ status: "failed" })
          .eq("payment_reference", productId);

        return new Response(
          JSON.stringify({
            success: false,
            message: "Payment verification failed",
            status: verifyData.status,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (req.method === "GET" && action === "callback") {
      // Handle eSewa callback (success redirect)
      const params = url.searchParams;
      const encodedData = params.get("data");

      if (!encodedData) {
        return new Response("Missing payment data", { status: 400 });
      }

      // Decode base64 response from eSewa
      const decodedData = JSON.parse(atob(encodedData));
      console.log("eSewa callback data:", decodedData);

      const { transaction_code, status, total_amount, transaction_uuid } = decodedData;

      if (status === "COMPLETE") {
        // Update subscription
        const { data: subscription } = await supabaseClient
          .from("subscriptions")
          .update({ 
            status: "active",
            payment_reference: transaction_code 
          })
          .eq("payment_reference", transaction_uuid)
          .select()
          .single();

        if (subscription) {
          // Add credits
          const creditsToAdd = subscription.plan === "pro" ? 5000 : 20000;
          await supabaseClient
            .from("user_credits")
            .update({ 
              balance: creditsToAdd,
              total_purchased: creditsToAdd 
            })
            .eq("user_id", subscription.user_id);
        }

        // Redirect to success page
        return new Response(null, {
          status: 302,
          headers: {
            Location: `${Deno.env.get("SITE_URL") || "http://localhost:5173"}/profile?payment=success`,
          },
        });
      } else {
        // Redirect to failure page
        return new Response(null, {
          status: 302,
          headers: {
            Location: `${Deno.env.get("SITE_URL") || "http://localhost:5173"}/payment?error=failed`,
          },
        });
      }
    }

    return new Response(
      JSON.stringify({ error: "Invalid endpoint" }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
