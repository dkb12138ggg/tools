import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type ThemeMode = 'light' | 'dark'

interface UIState {
  theme: ThemeMode
  navCollapsed: boolean
}

const initialState: UIState = {
  theme: (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light',
  navCollapsed: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setNavCollapsed(state, action: PayloadAction<boolean>) {
      state.navCollapsed = action.payload
    },
  },
})

export const { setTheme, toggleTheme, setNavCollapsed } = uiSlice.actions
export default uiSlice.reducer
