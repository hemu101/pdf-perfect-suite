import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface BusinessDetails {
  id: string;
  user_id: string;
  company_name: string | null;
  tax_id: string | null;
  billing_address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export const useBusinessDetails = () => {
  const { user } = useAuth();
  const [details, setDetails] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("business_details")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        // No details found, that's ok
        setDetails(null);
      } else if (error) {
        throw error;
      } else {
        setDetails(data);
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [user]);

  const saveDetails = async (businessDetails: Partial<BusinessDetails>) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      if (details) {
        // Update existing
        const { error } = await supabase
          .from("business_details")
          .update(businessDetails)
          .eq("user_id", user.id);

        if (error) throw error;

        setDetails((prev) => prev ? { ...prev, ...businessDetails } : null);
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("business_details")
          .insert({
            user_id: user.id,
            ...businessDetails,
          })
          .select()
          .single();

        if (error) throw error;
        setDetails(data);
      }

      toast.success("Business details saved successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to save business details");
      return { error };
    }
  };

  return {
    details,
    loading,
    saveDetails,
    refetch: fetchDetails,
  };
};
