import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  owner_id: string;
  member_email: string;
  member_name: string | null;
  role: string;
  status: string;
  invited_at: string;
  joined_at: string | null;
  created_at: string;
}

export const useTeam = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const inviteMember = async (email: string, name?: string, role: string = "member") => {
    if (!user) return { error: new Error("Not authenticated"), data: null };

    // Check if already invited
    const existing = members.find((m) => m.member_email === email);
    if (existing) {
      toast.error("This email has already been invited");
      return { error: new Error("Already invited"), data: null };
    }

    try {
      const { data, error } = await supabase
        .from("team_members")
        .insert({
          owner_id: user.id,
          member_email: email,
          member_name: name || null,
          role,
        })
        .select()
        .single();

      if (error) throw error;

      setMembers((prev) => [data, ...prev]);
      toast.success(`Invitation sent to ${email}`);
      return { error: null, data };
    } catch (error: any) {
      toast.error("Failed to send invitation");
      return { error, data: null };
    }
  };

  const updateMember = async (id: string, updates: Partial<TeamMember>) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("team_members")
        .update(updates)
        .eq("id", id)
        .eq("owner_id", user.id);

      if (error) throw error;

      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
      );
      toast.success("Team member updated successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to update team member");
      return { error };
    }
  };

  const removeMember = async (id: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id)
        .eq("owner_id", user.id);

      if (error) throw error;

      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Team member removed successfully");
      return { error: null };
    } catch (error: any) {
      toast.error("Failed to remove team member");
      return { error };
    }
  };

  const resendInvite = async (id: string) => {
    // In a real app, this would trigger an email
    toast.success("Invitation resent successfully");
    return { error: null };
  };

  return {
    members,
    loading,
    inviteMember,
    updateMember,
    removeMember,
    resendInvite,
    refetch: fetchMembers,
  };
};
