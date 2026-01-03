import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Signature {
  id: string;
  user_id: string;
  document_name: string;
  status: string;
  recipient_email: string | null;
  recipient_name: string | null;
  signed_at: string | null;
  expires_at: string | null;
  document_url: string | null;
  signature_data: string | null;
  created_at: string;
  updated_at: string;
}

interface SignatureTemplate {
  id: string;
  user_id: string;
  name: string;
  content: string | null;
  fields: unknown;
  created_at: string;
  updated_at: string;
}

export const useSignatures = () => {
  const { user } = useAuth();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [templates, setTemplates] = useState<SignatureTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSignatures = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("signatures")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSignatures(data || []);
    } catch (error) {
      console.error("Error fetching signatures:", error);
    }
  };

  const fetchTemplates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("signature_templates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchSignatures(), fetchTemplates()]);
      setLoading(false);
    };
    fetchAll();
  }, [user]);

  const createSignature = async (signature: {
    document_name: string;
    recipient_email?: string;
    recipient_name?: string;
    expires_at?: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated"), data: null };

    try {
      const { data, error } = await supabase
        .from("signatures")
        .insert({
          user_id: user.id,
          ...signature,
        })
        .select()
        .single();

      if (error) throw error;

      setSignatures((prev) => [data, ...prev]);
      toast.success("Signature request created successfully");
      return { error: null, data };
    } catch (error: any) {
      toast.error("Failed to create signature request");
      return { error, data: null };
    }
  };

  const updateSignature = async (id: string, updates: Partial<Signature>) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("signatures")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setSignatures((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
      );
      toast.success("Signature updated successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to update signature");
      return { error };
    }
  };

  const deleteSignature = async (id: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("signatures")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setSignatures((prev) => prev.filter((s) => s.id !== id));
      toast.success("Signature deleted successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to delete signature");
      return { error };
    }
  };

  const createTemplate = async (template: { name: string; content?: string }) => {
    if (!user) return { error: new Error("Not authenticated"), data: null };

    try {
      const { data, error } = await supabase
        .from("signature_templates")
        .insert({
          user_id: user.id,
          name: template.name,
          content: template.content || null,
        })
        .select()
        .single();

      if (error) throw error;

      setTemplates((prev) => [data, ...prev]);
      toast.success("Template created successfully");
      return { error: null, data };
    } catch (error: any) {
      toast.error("Failed to create template");
      return { error, data: null };
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("signature_templates")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Template deleted successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to delete template");
      return { error };
    }
  };

  // Computed values
  const sentSignatures = signatures.filter((s) => s.user_id === user?.id && s.status !== "signed");
  const inboxSignatures = signatures.filter((s) => s.recipient_email === user?.email && s.status === "pending");
  const signedSignatures = signatures.filter((s) => s.status === "signed");
  const pendingCount = signatures.filter((s) => s.status === "pending").length;

  return {
    signatures,
    templates,
    loading,
    sentSignatures,
    inboxSignatures,
    signedSignatures,
    pendingCount,
    createSignature,
    updateSignature,
    deleteSignature,
    createTemplate,
    deleteTemplate,
    refetch: () => Promise.all([fetchSignatures(), fetchTemplates()]),
  };
};
