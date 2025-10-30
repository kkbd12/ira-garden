// FIX: Moved the triple-slash directive for `vite/client` to the top of the file to ensure proper type resolution for environment variables.
/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

// --- START OF CONFIGURATION ---
// নির্দেশিকা: আপনার Supabase প্রজেক্টের URL এবং anon key এখন .env.local ফাইল থেকে লোড করা হচ্ছে।
// FIX: Added explicit 'string' type to prevent TypeScript from inferring a narrow literal type.
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
// FIX: Added explicit 'string' type to prevent TypeScript from inferring a narrow literal type.
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;
// --- END OF CONFIGURATION ---


// আপনি উপরের মানগুলি আপনার Supabase প্রজেক্টের Settings > API বিভাগ থেকে পাবেন।
// এই সংবেদনশীল কী-গুলি এনভায়রনমেন্ট ভেরিয়েবলে (.env file) সংরক্ষণ করার পরামর্শ দেওয়া হচ্ছে।

if (!supabaseUrl) {
    const errorMessage = "Supabase URL is not set. Please create a .env.local file and add VITE_SUPABASE_URL.";
    console.error(errorMessage);
    alert(errorMessage);
}
if (!supabaseKey) {
    const errorMessage = "Supabase Key is not set. Please create a .env.local file and add VITE_SUPABASE_ANON_KEY.";
    console.error(errorMessage);
    alert(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseKey)