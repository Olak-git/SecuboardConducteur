import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        lastID: null,
        data: {},
        total_course:0,
        total_km:0,
        scores:0,
        courses_en_attente:0
    },
    reducers: {
        setLastID: (state, action) => {
            state.lastID = action.payload;
        },
        setUser: (state, action) => {
            for(let index in action.payload) {
                state.data[index] = action.payload[index];
            }
        },
        setTotalCourse: (state, action) => {
            state.total_course = action.payload;
        },
        setTotalKm: (state, action) => {
            state.total_km = action.payload;
        },
        setScores: (state, action) => {
            state.scores = action.payload;
        },
        setCoursesEnAttente: (state, action) => {
            state.courses_en_attente = action.payload;
        },
        deleteIndex: (state, action) => {
            delete(state.data[action.payload]);
        },
        deleteUser: (state) => {
            state.data = {};
            state.total_course = 0;
            state.total_km = 0;
            state.scores = 0;
            state.courses_en_attente = 0;
        }
    }
})

export default userSlice.reducer;
export const { setLastID, setUser, setTotalCourse, setTotalKm, setScores, setCoursesEnAttente, deleteIndex, deleteUser } = userSlice.actions