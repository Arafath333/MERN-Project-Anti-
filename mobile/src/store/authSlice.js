import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { userInfo: null, token: null },
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload
            state.token = action.payload.token
        },
        logout: (state) => {
            state.userInfo = null
            state.token = null
        },
    },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
