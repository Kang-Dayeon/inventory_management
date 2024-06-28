import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import loadingSlice from "./slices/loadingSlice";

export default configureStore({
  reducer: {
    authSlice,
    loadingSlice
  }
})



