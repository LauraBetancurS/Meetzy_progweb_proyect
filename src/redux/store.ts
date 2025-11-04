import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/AppSlice";
import authReducer from "./slices/AuthSlice";
import eventsReducer from "./slices/EventsSlice";
import subscriptionsReducer from "./slices/SubscriptionsSlice";
import profileReducer from "./slices/ProfileSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
      auth: authReducer,  
    events: eventsReducer,
    subscriptions: subscriptionsReducer,
    profile: profileReducer, 
  },
});

// tipos para usar en toda la app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
