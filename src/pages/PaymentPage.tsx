import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Wallet, ArrowLeft, Shield, Check } from "lucide-react";

const plans = {
  pro: {
    name: "Pro",
    price: 9,
    priceNPR: 1200,
    period: "month",
    features: [
      "Unlimited tasks",
      "All PDF & Image tools",
      "Priority processing",
      "File size limit: 100MB",
      "Batch processing",
      "Priority email support",
      "No watermarks",
    ],
  },
  business: {
    name: "Business",
    price: 29,
    priceNPR: 3900,
    period: "month",
    features: [
      "Everything in Pro",
      "5 team members",
      "File size limit: 500MB",
      "API access",
      "Custom branding",
      "Dedicated support",
      "SSO integration",
      "Analytics dashboard",
    ],
  },
};

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "wallet" | null>(null);
  const [esewaId, setEsewaId] = useState("");
  
  const planId = searchParams.get("plan") as "pro" | "business";
  const plan = planId ? plans[planId] : null;

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Plan</h1>
            <p className="text-muted-foreground mb-6">Please select a valid plan from our pricing page.</p>
            <Button onClick={() => navigate("/pricing")}>View Plans</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">Please login or create an account to subscribe.</p>
            <Button onClick={() => navigate("/auth")}>Login / Sign Up</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleEsewaPayment = async () => {
    if (!esewaId.trim()) {
      toast({
        title: "eSewa ID Required",
        description: "Please enter your eSewa ID or phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create subscription record
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan: planId,
        status: "pending",
        payment_method: "esewa",
        payment_reference: esewaId,
        amount: plan.priceNPR,
        currency: "NPR",
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      // In production, redirect to eSewa payment gateway
      // For demo, simulate successful payment
      toast({
        title: "Payment Initiated",
        description: "You will be redirected to eSewa to complete payment. For demo purposes, your subscription is now active.",
      });

      // Update subscription to active (demo mode)
      await supabase
        .from("subscriptions")
        .update({ status: "active" })
        .eq("user_id", user.id)
        .eq("plan", planId);

      // Add credits for the plan
      const creditsToAdd = planId === "pro" ? 5000 : 20000;
      await supabase
        .from("user_credits")
        .update({ 
          balance: creditsToAdd,
          total_purchased: creditsToAdd 
        })
        .eq("user_id", user.id);

      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    setLoading(true);
    try {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan: planId,
        status: "pending",
        payment_method: "wallet",
        amount: plan.priceNPR,
        currency: "NPR",
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Wallet Payment",
        description: "Wallet payment feature coming soon! Your subscription request has been recorded.",
      });

      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/pricing")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
              
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-foreground">{plan.name} Plan</span>
                  <span className="text-primary font-bold">रू {plan.priceNPR}/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">Billed monthly</p>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-convert-to" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <div className="text-right">
                    <p className="font-bold text-xl text-foreground">रू {plan.priceNPR}</p>
                    <p className="text-sm text-muted-foreground">(${plan.price} USD)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure payment processing</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Payment Method</h2>

              <div className="space-y-4">
                {/* eSewa Option */}
                <div
                  onClick={() => setPaymentMethod("esewa")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "esewa"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">eSewa</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">eSewa</p>
                      <p className="text-sm text-muted-foreground">Pay with your eSewa wallet</p>
                    </div>
                  </div>

                  {paymentMethod === "esewa" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="esewa-id">eSewa ID / Phone Number</Label>
                        <Input
                          id="esewa-id"
                          placeholder="98XXXXXXXX"
                          value={esewaId}
                          onChange={(e) => setEsewaId(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button
                        onClick={handleEsewaPayment}
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        {loading ? "Processing..." : `Pay रू ${plan.priceNPR}`}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Wallet Option */}
                <div
                  onClick={() => setPaymentMethod("wallet")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "wallet"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Platform Wallet</p>
                      <p className="text-sm text-muted-foreground">Pay from your wallet balance</p>
                    </div>
                  </div>

                  {paymentMethod === "wallet" && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Wallet payment feature coming soon. You can add funds to your wallet and use them for subscriptions.
                      </p>
                      <Button
                        onClick={handleWalletPayment}
                        disabled={loading}
                        className="w-full"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        {loading ? "Processing..." : "Request Wallet Payment"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-6 text-xs text-muted-foreground text-center">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPage;
