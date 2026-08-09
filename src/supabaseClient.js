import { createClient } from '@supabase/supabase-js';

// Reemplaza esto con tus credenciales reales de Supabase
const supabaseUrl = 'https://esqnsnyhvveaoerbxnjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcW5zbnlodnZlYW9lcmJ4bmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NjU2OTksImV4cCI6MjA5OTU0MTY5OX0.VihpU2DP_LacJgX99zKhvMJLJkGdHFljVoHMk6I9hXM';

export const supabase = createClient(supabaseUrl, supabaseKey);