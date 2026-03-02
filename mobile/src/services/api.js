import axios from 'axios'

// Change this to your machine's local IP when testing on a physical device
// e.g., 'http://192.168.1.100:5000/api'
const BASE_URL = 'http://localhost:5000/api'

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 })

// Inject auth token
api.interceptors.request.use((config) => {
    const state = require('../store/store').store.getState()
    const token = state.auth.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
}

export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getFeatured: () => api.get('/products/featured'),
    getById: (id) => api.get(`/products/${id}`),
    getRelated: (id) => api.get(`/products/${id}/related`),
}

export const categoriesAPI = {
    getAll: () => api.get('/categories'),
}

export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getMine: () => api.get('/orders/mine'),
    getById: (id) => api.get(`/orders/${id}`),
}

export default api
