import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Credits {
  balance: number;
  totalPurchased: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  toolUsed: string | null;
  createdAt: string;
}

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<Credits | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCredits();
      fetchTransactions();
    } else {
      setCredits(null);
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCredits = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("user_credits")
      .select("balance, total_purchased")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setCredits({
        balance: data.balance,
        totalPurchased: data.total_purchased
      });
    }
    setLoading(false);
  };

  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setTransactions(data.map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        toolUsed: t.tool_used,
        createdAt: t.created_at
      })));
    }
  };

  const deductCredits = async (amount: number, toolId: string, description: string) => {
    if (!user) return { success: false, error: "Not authenticated" };
    
    const { data, error } = await supabase.rpc("deduct_credits", {
      p_user_id: user.id,
      p_amount: amount,
      p_tool: toolId,
      p_description: description
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "Insufficient credits" };
    }

    await fetchCredits();
    await fetchTransactions();
    return { success: true, error: null };
  };

  return { credits, transactions, loading, deductCredits, refetch: fetchCredits };
};
