import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserSettings {
  id: string;
  user_id: string;
  language: string;
  theme: string;
  email_notifications: boolean;
  marketing_emails: boolean;
  login_notifications: boolean;
  two_factor_enabled: boolean;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        // No settings found, create default
        const { data: newData, error: insertError } = await supabase
          .from("user_settings")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newData);
      } else if (error) {
        throw error;
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user || !settings) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("user_settings")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings((prev) => prev ? { ...prev, ...updates } : null);
      toast.success("Settings updated successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to update settings");
      return { error };
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };
};
