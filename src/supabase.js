import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yvmcrpyhmiawrwhkettf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bWNycHlobWlhd3J3aGtldHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEwNzk0MzAsImV4cCI6MjAwNjY1NTQzMH0.0J-O_hqZXUL7Zg8heG-dFhFe_hICv9GQx9K7pa1BrRI";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
