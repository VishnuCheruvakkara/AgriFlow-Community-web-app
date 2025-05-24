import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullPageLoading: false,
  buttonLoading: {}, // Store loading state for each button uniquely
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showFullPageLoader: (state) => {
      state.fullPageLoading = true;
    },
    hideFullPageLoader: (state) => {
      state.fullPageLoading = false;
    },
    showButtonLoader: (state, action) => {
      state.buttonLoading[action.payload] = true; // Unique key for button
    },
    hideButtonLoader: (state, action) => {
      state.buttonLoading[action.payload] = false;
    },
  },
});

export const {
  showFullPageLoader,
  hideFullPageLoader,
  showButtonLoader,
  hideButtonLoader,
} = loaderSlice.actions;
export default loaderSlice.reducer;
