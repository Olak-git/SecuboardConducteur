import { createSlice } from "@reduxjs/toolkit";

export const initSlice = createSlice({
    name: 'init',
    initialState: {
        presentation: false,
        welcome: false,
        stopped: false,
        otp_authentication: false,
        disponibilite: false,
        disponibilite_course: true,
        disponibilite_reservation: true,
    },
    reducers: {
        setPresentation: (state, action) => {
            state.presentation = action.payload
        },
        setWelcome: (state, action) => {
            state.welcome = action.payload
        },
        setStopped: (state, action) => {
            state.stopped = action.payload
        },
        setOtpAuthentication: (state, action) => {
            state.otp_authentication = action.payload
        },
        setDisponibilite: (state, action) => {
            state.disponibilite = action.payload
        },
        setDisponibiliteCourse: (state, action) => {
            state.disponibilite_course = action.payload
        },
        setDisponibiliteReservation: (state, action) => {
            state.disponibilite_reservation = action.payload
        }
    }
})

export default initSlice.reducer;
export const { setPresentation, setWelcome, setDisponibilite, setDisponibiliteCourse, setDisponibiliteReservation, setStopped, setOtpAuthentication } = initSlice.actions