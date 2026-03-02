import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        cart: cartReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})
