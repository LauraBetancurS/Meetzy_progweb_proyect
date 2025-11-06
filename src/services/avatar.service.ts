// src/services/avatar.service.ts
import { supabase } from "./supabaseClient";

/**
 * Uploads an avatar image to Supabase Storage under a per-user folder
 * and saves the public URL in the 'profiles' table and user metadata.
 */
export async function uploadAndSaveAvatar(file: File, userId: string) {
  if (!file || !userId)
    return { url: undefined, path: undefined, error: new Error("Missing file or userId") };

  // ---------- STEP 1: Upload the avatar ----------
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `avatar_${crypto.randomUUID()}.${ext}`;
  const path = `${userId}/${fileName}`; // per-user folder: avatars/<userId>/<fileName>

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError)
    return { url: undefined, path: undefined, error: uploadError };

  // ---------- STEP 2: Get the public URL ----------
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = data.publicUrl;

  // ---------- STEP 3: Save avatar URL in 'profiles' ----------
  const { error: profileErr } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (profileErr)
    return { url: avatarUrl, path, error: profileErr };

  // ---------- STEP 4: Update user metadata (optional but recommended) ----------
  const { error: metaErr } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (metaErr)
    return { url: avatarUrl, path, error: metaErr };

  return { url: avatarUrl, path, error: null };
}
