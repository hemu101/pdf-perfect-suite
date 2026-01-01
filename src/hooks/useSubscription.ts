import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  paymentMethod: string | null;
  amount: number | null;
  currency: string | null;
  startedAt: string;
  expiresAt: string | null;
}

interface BillingHistory {
  id: string;
  plan: string;
  amount: number | null;
  currency: string | null;
  status: string;
  paymentMethod: string | null;
  createdAt: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchBillingHistory();
    } else {
      setSubscription(null);
      setBillingHistory([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setSubscription({
        id: data.id,
        plan: data.plan,
        status: data.status,
        paymentMethod: data.payment_method,
        amount: data.amount,
        currency: data.currency,
        startedAt: data.started_at,
        expiresAt: data.expires_at,
      });
    }
    setLoading(false);
  };

  const fetchBillingHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBillingHistory(
        data.map((item) => ({
          id: item.id,
          plan: item.plan,
          amount: item.amount,
          currency: item.currency,
          status: item.status,
          paymentMethod: item.payment_method,
          createdAt: item.created_at,
        }))
      );
    }
  };

  const cancelSubscription = async () => {
    if (!user || !subscription) return { success: false, error: "No active subscription" };

    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("id", subscription.id);

    if (error) {
      return { success: false, error: error.message };
    }

    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled. You'll retain access until the end of your billing period.",
    });

    await fetchSubscription();
    await fetchBillingHistory();
    return { success: true, error: null };
  };

  const upgradePlan = async (newPlan: string) => {
    if (!user) return { success: false, error: "Not authenticated" };

    // Cancel current subscription if exists
    if (subscription) {
      await supabase
        .from("subscriptions")
        .update({ status: "upgraded" })
        .eq("id", subscription.id);
    }

    return { success: true, error: null, redirectTo: `/payment?plan=${newPlan}` };
  };

  const downgradePlan = async (newPlan: string) => {
    if (!user) return { success: false, error: "Not authenticated" };

    if (newPlan === "free") {
      // Cancel current subscription
      if (subscription) {
        await supabase
          .from("subscriptions")
          .update({ status: "downgraded" })
          .eq("id", subscription.id);
      }

      toast({
        title: "Downgraded to Free",
        description: "Your plan has been downgraded. You'll retain Pro features until the end of your billing period.",
      });

      await fetchSubscription();
      await fetchBillingHistory();
      return { success: true, error: null };
    }

    return { success: true, error: null, redirectTo: `/payment?plan=${newPlan}` };
  };

  return {
    subscription,
    billingHistory,
    loading,
    cancelSubscription,
    upgradePlan,
    downgradePlan,
    refetch: fetchSubscription,
  };
};
