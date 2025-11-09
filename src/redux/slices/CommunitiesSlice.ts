import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  CommunityModel,
  NewCommunityInput,
  UpdateCommunityInput,
} from "../../types/Community";
import {
  fetchAllCommunities,
  fetchCommunityById,
  fetchMyCommunities,
  createCommunity as createCommunityService,
  updateCommunity as updateCommunityService,
  deleteCommunity,
  addMemberToCommunity as addMemberService,
  removeMemberFromCommunity as removeMemberService,
  selectEventForCommunity as selectEventService,
  deselectEventFromCommunity as deselectEventService,
} from "../../services/communitiesServices";

import { subscribeToEvent } from "./EventsSlice";

export interface CommunitiesState {
  communities: CommunityModel[];
  currentCommunity: CommunityModel | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommunitiesState = {
  communities: [],
  currentCommunity: null,
  loading: false,
  error: null,
};

export const loadAllCommunities = createAsyncThunk(
  "communities/loadAllCommunities",
  async (_, { rejectWithValue }) => {
    const { data, error } = await fetchAllCommunities();
    if (error) return rejectWithValue(error);
    return data;
  }
);

export const loadMyCommunities = createAsyncThunk(
  "communities/loadMyCommunities",
  async (_, { rejectWithValue }) => {
    const { data, error } = await fetchMyCommunities();
    if (error) return rejectWithValue(error);
    return data;
  }
);

export const loadCommunityById = createAsyncThunk(
  "communities/loadCommunityById",
  async (communityId: string, { rejectWithValue }) => {
    const { data, error } = await fetchCommunityById(communityId);
    if (error || !data) return rejectWithValue(error || "Community not found");
    return data;
  }
);

// Create community
export const createNewCommunity = createAsyncThunk(
  "communities/createNewCommunity",
  async (input: NewCommunityInput, { rejectWithValue }) => {
    const { data, error } = await createCommunityService(input);
    if (error || !data)
      return rejectWithValue(error || "Error al crear comunidad");
    return data;
  }
);

// Update community
export const updateExistingCommunity = createAsyncThunk(
  "communities/updateExistingCommunity",
  async (
    { id, patch }: { id: string; patch: UpdateCommunityInput },
    { rejectWithValue }
  ) => {
    const { data, error } = await updateCommunityService(id, patch);
    if (error || !data)
      return rejectWithValue(error || "Error al actualizar comunidad");
    return data;
  }
);

// Delete community
export const deleteExistingCommunity = createAsyncThunk(
  "communities/deleteExistingCommunity",
  async (id: string, { rejectWithValue }) => {
    const { ok, error } = await deleteCommunity(id);
    if (!ok) return rejectWithValue(error || "Error al eliminar comunidad");
    return id;
  }
);

// Add member to community
export const addMemberThunk = createAsyncThunk(
  "communities/addMember",
  async (
    { communityId, userId }: { communityId: string; userId: string },
    { rejectWithValue }
  ) => {
    const { ok, error } = await addMemberService(communityId, userId);
    if (!ok) return rejectWithValue(error || "Error al agregar miembro");
    // Reload community to get updated member list
    const { data } = await fetchCommunityById(communityId);
    subscribeToEvent({ eventId: communityId, userId });
    return data;
  }
);

// Remove member from community
export const removeMemberThunk = createAsyncThunk(
  "communities/removeMember",
  async (
    { communityId, userId }: { communityId: string; userId: string },
    { rejectWithValue }
  ) => {
    const { ok, error } = await removeMemberService(communityId, userId);
    if (!ok) return rejectWithValue(error || "Error al remover miembro");
    // Reload community to get updated member list
    const { data } = await fetchCommunityById(communityId);
    return data;
  }
);

// Select event for community
export const selectEventThunk = createAsyncThunk(
  "communities/selectEvent",
  async (
    { communityId, eventId }: { communityId: string; eventId: string },
    { rejectWithValue }
  ) => {
    const { ok, error } = await selectEventService(communityId, eventId);
    if (!ok) return rejectWithValue(error || "Error al seleccionar evento");
    // Reload community to get updated event list
    const { data } = await fetchCommunityById(communityId);
    return data;
  }
);

// Deselect event from community
export const deselectEventThunk = createAsyncThunk(
  "communities/deselectEvent",
  async (
    { communityId, eventId }: { communityId: string; eventId: string },
    { rejectWithValue }
  ) => {
    const { ok, error } = await deselectEventService(communityId, eventId);
    if (!ok) return rejectWithValue(error || "Error al deseleccionar evento");
    // Reload community to get updated event list
    const { data } = await fetchCommunityById(communityId);
    return data;
  }
);

const communitiesSlice = createSlice({
  name: "communities",
  initialState,
  reducers: {
    clearCommunities: (state) => {
      state.communities = [];
      state.currentCommunity = null;
    },
    setCurrentCommunity: (
      state,
      action: PayloadAction<CommunityModel | null>
    ) => {
      state.currentCommunity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all communities
      .addCase(loadAllCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadAllCommunities.fulfilled,
        (state, action: PayloadAction<CommunityModel[]>) => {
          state.communities = action.payload;
          state.loading = false;
        }
      )
      .addCase(loadAllCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Load my communities
      .addCase(
        loadMyCommunities.fulfilled,
        (state, action: PayloadAction<CommunityModel[]>) => {
          state.communities = action.payload;
        }
      )

      // Load community by ID
      .addCase(loadCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadCommunityById.fulfilled,
        (state, action: PayloadAction<CommunityModel>) => {
          state.currentCommunity = action.payload;
          // Update in communities list if exists
          const index = state.communities.findIndex(
            (c) => c.id === action.payload.id
          );
          if (index >= 0) {
            state.communities[index] = action.payload;
          } else {
            state.communities.push(action.payload);
          }
          state.loading = false;
        }
      )
      .addCase(loadCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create community
      .addCase(
        createNewCommunity.fulfilled,
        (state, action: PayloadAction<CommunityModel>) => {
          state.communities.push(action.payload);
          console.log(state.communities);
          
        }
      )

      // Update community
      .addCase(
        updateExistingCommunity.fulfilled,
        (state, action: PayloadAction<CommunityModel>) => {
          const idx = state.communities.findIndex(
            (c) => c.id === action.payload.id
          );
          if (idx >= 0) state.communities[idx] = action.payload;
          if (state.currentCommunity?.id === action.payload.id) {
            state.currentCommunity = action.payload;
          }
        }
      )

      // Delete community
      .addCase(
        deleteExistingCommunity.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.communities = state.communities.filter(
            (c) => c.id !== action.payload
          );
          if (state.currentCommunity?.id === action.payload) {
            state.currentCommunity = null;
          }
        }
      )

      // Add/Remove member (updates current community)
      .addCase(
        addMemberThunk.fulfilled,
        (state, action: PayloadAction<CommunityModel | null>) => {
          if (action.payload) {
            const idx = state.communities.findIndex(
              (c) => c.id === action.payload!.id
            );
            if (idx >= 0) state.communities[idx] = action.payload;
            if (state.currentCommunity?.id === action.payload.id) {
              state.currentCommunity = action.payload;
            }
          }
        }
      )
      .addCase(
        removeMemberThunk.fulfilled,
        (state, action: PayloadAction<CommunityModel | null>) => {
          if (action.payload) {
            const idx = state.communities.findIndex(
              (c) => c.id === action.payload!.id
            );
            if (idx >= 0) state.communities[idx] = action.payload;
            if (state.currentCommunity?.id === action.payload.id) {
              state.currentCommunity = action.payload;
            }
          }
        }
      )

      // Select/Deselect event (updates current community)
      .addCase(
        selectEventThunk.fulfilled,
        (state, action: PayloadAction<CommunityModel | null>) => {
          if (action.payload) {
            const idx = state.communities.findIndex(
              (c) => c.id === action.payload!.id
            );
            if (idx >= 0) state.communities[idx] = action.payload;
            if (state.currentCommunity?.id === action.payload.id) {
              state.currentCommunity = action.payload;
            }
          }
        }
      )
      .addCase(
        deselectEventThunk.fulfilled,
        (state, action: PayloadAction<CommunityModel | null>) => {
          if (action.payload) {
            const idx = state.communities.findIndex(
              (c) => c.id === action.payload!.id
            );
            if (idx >= 0) state.communities[idx] = action.payload;
            if (state.currentCommunity?.id === action.payload.id) {
              state.currentCommunity = action.payload;
            }
          }
        }
      );
  },
});

export const { clearCommunities, setCurrentCommunity } =
  communitiesSlice.actions;
export default communitiesSlice.reducer;
