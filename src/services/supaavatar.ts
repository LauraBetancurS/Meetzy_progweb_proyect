import { supabase } from "./supabaseClient";

// Función principal
export const uploadAndSaveAvatar = async (file: File, userId: string) => {
  if (!file || !userId) {
    return { url: undefined, path: undefined, error: new Error("Falta el archivo o el userId") };
  }

  // Subir el avatar
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `avatar_${crypto.randomUUID()}.${ext}`;
  const path = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) return { url: undefined, path, error: uploadError };

  // Obtener la URL pública
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = data.publicUrl;

  // Guardar URL en la tabla profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (profileError) return { url: avatarUrl, path, error: profileError };

  // Actualizar metadata del usuario (opcional)
  const { error: metaError } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (metaError) return { url: avatarUrl, path, error: metaError };

  return { url: avatarUrl, path, error: null };
};
