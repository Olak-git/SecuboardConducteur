import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
    name: 'course',
    initialState: {
        coords: {
            course: {},
            reservation: {}
        }
    },
    reducers: {
        addCourse: (state, action) => {
            Object.assign(state.coords.course, action.payload);
            // let key = Object.keys(action.payload)[0];
            // state.coords.course[key] = action.payload[key];
        },
        setCourse: (state, action) => {
            let key = Object.keys(action.payload)[0];
            if(Object.keys(state.coords.course).indexOf(key) == -1) {
                Object.assign(state.coords.course, action.payload);
            } else {
                Object.assign(state.coords.course[key], action.payload[key]);
            }
        },
        deleteCourse: (state, action) => {
            if(Object.keys(state.coords.course).indexOf(action.payload) !== -1)
                delete(state.coords.course[action.payload]);
        },
        addReservation: (state, action) => {
            Object.assign(state.coords.reservation, action.payload);
            // let key = Object.keys(action.payload)[0];
            // state.coords.reservation[key] = action.payload[key];
        },
        setReservation: (state, action) => {
            let key = Object.keys(action.payload)[0];
            if(Object.keys(state.coords.reservation).indexOf(key) == -1) {
                Object.assign(state.coords.reservation, action.payload);
            } else {
                Object.assign(state.coords.reservation[key], action.payload[key]);
            }
        },
        deleteReservation: (state, action) => {
            if(Object.keys(state.coords.reservation).indexOf(action.payload) !== -1)
                delete(state.coords.reservation[action.payload]);
        },
        resetCoords: (state) => {
            state.coords = {
                course: {},
                reservation: {}
            };
        }
    }
})

export default courseSlice.reducer;
export const { addCourse, setCourse, deleteCourse, addReservation, setReservation, deleteReservation, resetCoords } = courseSlice.actions