import { createSlice } from "@reduxjs/toolkit";

export const welcomeSlice = createSlice({
    name: 'welcome',
    initialState: {
        welcome: false
    },
    reducers: {
        setWelcome: (state, action) => {
            state.welcome = action.payload
        }
    }
})

export default welcomeSlice.reducer;
export const { setWelcome } = welcomeSlice.actions