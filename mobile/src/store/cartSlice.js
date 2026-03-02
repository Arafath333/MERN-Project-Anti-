import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: { cartItems: [] },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload
            const exists = state.cartItems.find((x) => x._id === item._id)
            if (exists) {
                exists.quantity = Math.min(exists.quantity + item.quantity, item.stock || 99)
            } else {
                state.cartItems.push({ ...item, quantity: item.quantity || 1 })
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload
            const item = state.cartItems.find((x) => x._id === id)
            if (item) item.quantity = quantity
        },
        clearCart: (state) => { state.cartItems = [] },
    },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
