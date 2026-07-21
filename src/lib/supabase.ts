export { supabase } from "@/integrations/supabase/client";

export type Review = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
};
