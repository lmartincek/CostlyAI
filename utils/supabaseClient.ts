import {createClient} from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}`})

export const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);