import { createSlice } from "@reduxjs/toolkit";

export const presentationSlice = createSlice({
    name: 'presentation',
    initialState: {
        presentation: false
    },
    reducers: {
        setPresentation: (state, action) => {
            state.presentation = action.payload
        }
    }
})

export default presentationSlice.reducer;
export const { setPresentation } = presentationSlice.actions