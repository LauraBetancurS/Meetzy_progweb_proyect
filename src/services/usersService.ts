import type { Profile } from "../types/Profile";
import { supabase } from "./supabaseClient";


export async function getprofileinfo(userId: string): Promise<Profile> {
    const {data: profile, error} =await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    
    if (error || !profile || profile.length === 0) {
        return { id: '', email: '', fullName: '', user_name: '', avatarUrl: null };
    }
    const p = profile[0];
    return {
        ...p,
        user_name: p.user_name || p.user_name || '',
        avatarUrl: p.avatarUrl || p.avatar_url || ''
    };

}

