import type { PostsModel, NewPostInput, PostsRow } from "../types/postsServices";
import { supabase } from "./supabaseClient";

async function  getcurrentuser  (): Promise<string | null>{
    const { data, error } = await supabase.auth.getUser();
      if (error) return null;
      return data.user?.id ?? null;

}


export async function fetchPostsByCommunityId(communityId: string): Promise<{ data: PostsModel[]; error?: string }> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("comunity_id", communityId)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    const rows = (data ?? []) as PostsRow[];
    const posts: PostsModel[] = rows.map((r) => ({
      id: r.id,
      createdAt: r.created_at,
      communityId: r.comunity_id,
      text: r.text,
      createdBy: r.created_by,
      postImageUrl: r.post_image_url ?? null,
    }));

    return { data: posts };
}
export async function createPostService(input: NewPostInput): Promise<{ data: PostsModel | null; error?: string }> {
   const currentUserId = await getcurrentuser();
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          // DB column is named `comunity_id` (nullable/typo in schema)
          comunity_id: input.communityId,

          text: input.text,
          // prefer provided createdBy (from the app) but fall back to the currently authenticated user
          created_by: input.createdBy ?? currentUserId,
          post_image_url: input.postiamgeUrl ?? null,
        },
      ])
      .select();

    if (error) {
      return { data: null, error: error.message };
    }

    const row = (data && (data as PostsRow[])[0]) as PostsRow | undefined;
    if (!row) return { data: null };

    const post: PostsModel = {
      id: row.id,
      createdAt: row.created_at,
      communityId: row.comunity_id,
      text: row.text,
      createdBy: row.created_by,
      postImageUrl: row.post_image_url ?? null,
    };

    return { data: post };
}


                