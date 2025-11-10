import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PollModel } from "../../types/Poll";
import { createPoll, fetchPollsByCommunity, votePoll } from "../../services/pollServices";

interface PollsState {
  items: PollModel[];
  loading: boolean;
  error: string | null;
}

const initialState: PollsState = {
  items: [],
  loading: false,
  error: null,
};

export const createPollThunk = createAsyncThunk(
  "polls/create",
  async (input: { question: string; options: string[]; communityId: string }) => {
    const { data, error } = await createPoll(input);
    if (error || !data) throw new Error(error || "Failed to create poll");
    return data;
  }
);

export const fetchPollsThunk = createAsyncThunk(
  "polls/fetchByCommunity",
  async (communityId: string) => {
    const { data, error } = await fetchPollsByCommunity(communityId);
    if (error) throw new Error(error);
    return data;
  }
);

export const voteInPollThunk = createAsyncThunk(
  "polls/vote",
  async (input: { pollId: string; optionId: string }) => {
    const result = await votePoll(input.pollId, input.optionId);
    if (!result || !result.success) throw new Error(result?.error || "Failed to vote");
    // return authoritative count when available
    return { pollId: input.pollId, optionId: input.optionId, voteCount: (result as any).voteCount ?? null };
  }
);

const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    updatePollVotes: (state, action) => {
      const { pollId, optionId, voteCount } = action.payload;
      const poll = state.items.find((p) => p.id === pollId);
      if (poll) {
        const option = poll.options.find((o) => o.id === optionId);
        if (option) {
          option.voteCount = voteCount;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create poll
      .addCase(createPollThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPollThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPollThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create poll";
      })
      // Fetch polls
      .addCase(fetchPollsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPollsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPollsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch polls";
      })
      // Vote in poll  help to refresh when new votes come in
      .addCase(voteInPollThunk.fulfilled, (state, action) => {
        const { pollId, optionId, voteCount } = action.payload as { pollId: string; optionId: string; voteCount: number | null };
        const poll = state.items.find((p) => p.id === pollId);
        
        
        if (poll) {
          const option = poll.options.find((o) => o.id === optionId);
          console.log(option);
          
          if (option) {
            // Only update if we have an authoritative count from the server
            if (typeof voteCount === 'number') {
              option.voteCount = voteCount;
            } else {
              console.warn('Received null voteCount from server - vote may not have been processed correctly');
            }
          }
        }
      });
  },
});

export const { updatePollVotes } = pollsSlice.actions;
export default pollsSlice.reducer;