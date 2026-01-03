import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  actions: unknown;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useWorkflows = () => {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error("Error fetching workflows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [user]);

  const createWorkflow = async (workflow: { name: string; description?: string; trigger_type?: string }) => {
    if (!user) return { error: new Error("Not authenticated"), data: null };

    try {
      const { data, error } = await supabase
        .from("workflows")
        .insert({
          user_id: user.id,
          name: workflow.name,
          description: workflow.description || null,
          trigger_type: workflow.trigger_type || "manual",
        })
        .select()
        .single();

      if (error) throw error;

      setWorkflows((prev) => [data, ...prev]);
      toast.success("Workflow created successfully");
      return { error: null, data };
    } catch (error: any) {
      toast.error("Failed to create workflow");
      return { error, data: null };
    }
  };

  const updateWorkflow = async (id: string, updates: { name?: string; description?: string; trigger_type?: string; is_active?: boolean }) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("workflows")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setWorkflows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
      );
      toast.success("Workflow updated successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to update workflow");
      return { error };
    }
  };

  const deleteWorkflow = async (id: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("workflows")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setWorkflows((prev) => prev.filter((w) => w.id !== id));
      toast.success("Workflow deleted successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to delete workflow");
      return { error };
    }
  };

  const toggleWorkflow = async (id: string, is_active: boolean) => {
    return updateWorkflow(id, { is_active });
  };

  return {
    workflows,
    loading,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflow,
    refetch: fetchWorkflows,
  };
};
