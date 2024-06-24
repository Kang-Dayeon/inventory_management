import { configureStore } from "@reduxjs/toolkit";
import { persistedReducer } from "./rootReducer";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
  devTools: true,
})

export const persist = persistStore(store)



