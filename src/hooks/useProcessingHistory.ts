import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProcessingRecord {
  id: string;
  toolId: string;
  fileName: string | null;
  fileSize: number | null;
  outputFormat: string | null;
  creditsUsed: number;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export const useProcessingHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ProcessingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const query = supabase
      .from("processing_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (user) {
      query.eq("user_id", user.id);
    } else {
      query.is("user_id", null);
    }

    const { data, error } = await query;

    if (!error && data) {
      setHistory(data.map(h => ({
        id: h.id,
        toolId: h.tool_id,
        fileName: h.file_name,
        fileSize: h.file_size,
        outputFormat: h.output_format,
        creditsUsed: h.credits_used || 0,
        status: h.status || "completed",
        metadata: (h.metadata as Record<string, unknown>) || {},
        createdAt: h.created_at
      })));
    }
    setLoading(false);
  };

  const addRecord = async (record: Omit<ProcessingRecord, "id" | "createdAt">) => {
    const insertData: any = {
      tool_id: record.toolId,
      file_name: record.fileName,
      file_size: record.fileSize,
      output_format: record.outputFormat,
      credits_used: record.creditsUsed,
      status: record.status,
      metadata: record.metadata
    };
    if (user?.id) insertData.user_id = user.id;
    
    const { data, error } = await supabase
      .from("processing_history")
      .insert(insertData)
      .select()
      .single();

    if (!error && data) {
      await fetchHistory();
      return { success: true, record: data };
    }
    return { success: false, error: error?.message };
  };

  return { history, loading, addRecord, refetch: fetchHistory };
};
