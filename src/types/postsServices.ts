
export type PostsModel = {
    id: number;
    createdAt: string;
    communityId: string;
    text: string;
    createdBy: string;
    postImageUrl?: string | null ;
};


export type PostsRow = {
    id: number;
    created_at: string;
    comunity_id: string;
    text: string;
    created_by: string;
    post_image_url?: string | null;
};

export type NewPostInput = {
    communityId: string;
    text: string;
    createdBy: string;
    postiamgeUrl?: string | null
};

