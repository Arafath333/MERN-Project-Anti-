import { createSlice } from '@reduxjs/toolkit'

const cartItems = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : []

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems,
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        paymentMethod: 'stripe',
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload
            const exists = state.cartItems.find((x) => x._id === item._id)
            if (exists) {
                exists.quantity = item.quantity
            } else {
                state.cartItems.push(item)
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        updateCartQuantity: (state, action) => {
            const { id, quantity } = action.payload
            const item = state.cartItems.find((x) => x._id === id)
            if (item) item.quantity = quantity
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        clearCart: (state) => {
            state.cartItems = []
            localStorage.removeItem('cartItems')
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload))
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
        },
    },
})

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions
export default cartSlice.reducer
