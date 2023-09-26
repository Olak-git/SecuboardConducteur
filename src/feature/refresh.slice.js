import { createSlice } from "@reduxjs/toolkit";

export const refreshSlice = createSlice({
    name: 'refresh',
    initialState: {
        historique_courses: 0,
        historique_reservations: 0,
        historique_covoiturages: 0,
        course: 0,
        reservation: 0,
        covoiturage: 0
    },
    reducers: {
        refreshHistoriqueCoures: (state) => {
            ++state.historique_courses;
        },
        refreshHistoriqueReservations: (state) => {
            ++state.historique_reservations;
        },
        refreshHistoriqueCovoiturages: (state) => {
            ++state.historique_covoiturages;
        },
        refreshCourse: (state) => {
            ++state.course;
        },
        refreshReservation: (state) => {
            ++state.reservation;
        },
        refreshCovoiturage: (state) => {
            ++state.covoiturage;
        }
    }
})

export default refreshSlice.reducer;
export const { refreshHistoriqueCoures, refreshHistoriqueReservations, refreshHistoriqueCovoiturages, refreshCourse, refreshReservation, refreshCovoiturage } = refreshSlice.actions