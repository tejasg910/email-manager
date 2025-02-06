import { supabase } from "./supabse";

export const getBlackList = async (user_id: string) => {
    const { data, error } = await supabase.from("email_blacklist").select("*").eq("user_id", user_id);
    return data;
}



export const getBlackListByEmail = async (email: string, user_id: string) => {
    const { data, error } = await supabase.from("email_blacklist").select("*").eq("email", email).eq("user_id", user_id).single();
    return data;
}



