import { createClient } from "@supabase/supabase-js";

// Enterprise Architecture: Connects the Next.js Edge / Client directly to Supabase resources.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "public-anon-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
