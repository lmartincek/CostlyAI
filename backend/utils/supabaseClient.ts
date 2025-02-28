import {createClient} from "@supabase/supabase-js";
import dotenv from "dotenv";

//TODO later fix handling env files automatically and share it across the app
// dotenv.config({path: '.env.local'})
dotenv.config({path: '.env.production'})

export const supabase = createClient(
    process.env.DB_URL!,
    process.env.DB_KEY!
);