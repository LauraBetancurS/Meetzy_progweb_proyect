import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PostsModel } from "../../types/postsServices";
import { createPostService, fetchPostsByCommunityId } from "../../services/postsServices";

interface PostsState {
    communityId?: string | null;
    posts: PostsModel[];
    loading: boolean;
    error: string | null;
}
const initialState: PostsState = {
    communityId: null,
    posts: [],
    loading: false,
    error: null
}

export const createnewpost = createAsyncThunk<PostsModel, { text: string; communityId: string; postiamgeUrl?: string | null; createdById: string }>(
    "posts/createnewpost",
    async (payload, { rejectWithValue }) => {
        const { data, error } = await createPostService({
            communityId: payload.communityId,
            text: payload.text,
            createdBy: payload.createdById,
            postiamgeUrl: payload.postiamgeUrl ?? null
        });
        if (error || !data) {
            return rejectWithValue(error || "Failed to create post");
        }
        return data as PostsModel; 
    }
);

export const fetchPostsByCommunity = createAsyncThunk<{ communityId: string; posts: PostsModel[] }, string>(
    "posts/fetchByCommunity",
    async (communityId: string) => {
        const { data, error } = await fetchPostsByCommunityId(communityId);
        if (error) {
            throw new Error(error);
        }
        return { communityId, posts: data } as { communityId: string; posts: PostsModel[] };
    }
);

const PostsSlices = createSlice({
    name: "posts",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(createnewpost.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createnewpost.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.posts.push(action.payload);
            }
        })
        .addCase(createnewpost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message ?? "Failed to create post";
        })
        .addCase(fetchPostsByCommunity.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPostsByCommunity.fulfilled, (state, action) => {
            state.loading = false;
            state.communityId = action.payload.communityId;
            state.posts = action.payload.posts;
        })
        .addCase(fetchPostsByCommunity.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message ?? "Failed to load posts";
        })
    }
    
})

export const {  } = PostsSlices.actions;

export default PostsSlices.reducer;