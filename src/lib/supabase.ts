import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey);

export type Review = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
};
