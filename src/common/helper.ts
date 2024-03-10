import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFileToSupabase = async (filename: string, buffer: File): Promise<any> => {
    const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET ?? "")
        .upload(filename, buffer, { contentType: "image/png" });
    const { data } = supabase.storage
        .from(process.env.SUPABASE_BUCKET ?? "")
        .getPublicUrl(filename);

    if (error) console.log(error);
    return data;
};