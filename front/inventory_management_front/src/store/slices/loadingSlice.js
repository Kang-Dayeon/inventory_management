import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: 'loadingSlice',
  initialState: {
    isLoading: false
  },
  reducers: {
    loadingStart: (state) => {
      console.log("start")
      state.isLoading = true
    },
    loadingEnd: (state) => {
      console.log("end")
      state.isLoading = false
    }
  }
})

export const {loadingStart, loadingEnd} = loadingSlice.actions

export default loadingSlice.reducer