import { PlayerData } from "@/app/api/player/PlayerInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMeAction {
  me: PlayerData | null;
}

const initStateMenu: IMeAction = {
  me: null,
};

const meSlice = createSlice({
  name: "meRedux",
  initialState: initStateMenu,
  reducers: {
    updateMe: (state, action: PayloadAction<PlayerData | null>) => {
      state.me = action.payload;
    },
    clearMe: (state) => {
      state.me = null;
    },
  },
});

export const { updateMe, clearMe } = meSlice.actions;
export default meSlice.reducer;
