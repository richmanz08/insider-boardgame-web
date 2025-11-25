import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMeAction {
  name: string;
}

const initStateMenu: IMeAction = {
  name: "",
};

const meSlice = createSlice({
  name: "meRedux",
  initialState: initStateMenu,
  reducers: {
    updateMe: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    clearMe: (state) => {
      state.name = "";
    },
  },
});

export const { updateMe, clearMe } = meSlice.actions;
export default meSlice.reducer;
