import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/AppSlice";
import authReducer from "./slices/AuthSlice";
import eventsReducer from "./slices/EventsSlice";
import subscriptionsReducer from "./slices/SubscriptionsSlice";
import a11yReducer from "./slices/a11ySlice";
import profileReducer from "./slices/ProfileSlice";
import communitiesReducer from "./slices/CommunitiesSlice";
import pollsReducer from './slices/PollsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    events: eventsReducer,
    subscriptions: subscriptionsReducer,
    a11y: a11yReducer,    
    profile: profileReducer,        
    communities: communitiesReducer,
    polls: pollsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
