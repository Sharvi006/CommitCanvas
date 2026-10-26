import { createSlice } from '@reduxjs/toolkit';

const LS_KEY = 'commit_canvas_completed';

const loadCompleted = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
};

const initialState = {
  currentLevelId: 'lvl-1',
  completedLevels: loadCompleted(),
  isSuccessModalOpen: false,
};

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setLevel(state, action) {
      state.currentLevelId = action.payload;
      state.isSuccessModalOpen = false;
    },
    markLevelSuccess(state, action) {
      const levelId = action.payload;
      if (!state.completedLevels.includes(levelId)) {
        state.completedLevels.push(levelId);
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(state.completedLevels));
        } catch {
          // storage unavailable
        }
      }
      state.isSuccessModalOpen = true;
    },
    closeModal(state) {
      state.isSuccessModalOpen = false;
    },
  },
});

export const { setLevel, markLevelSuccess, closeModal } = challengeSlice.actions;
export default challengeSlice.reducer;
