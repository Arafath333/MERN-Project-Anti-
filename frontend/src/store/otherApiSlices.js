import { apiSlice } from './apiSlice'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
        }),
        register: builder.mutation({
            query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
        }),
        getMe: builder.query({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({ url: '/auth/profile', method: 'PUT', body: data }),
            invalidatesTags: ['User'],
        }),
        toggleWishlist: builder.mutation({
            query: (productId) => ({ url: `/auth/wishlist/${productId}`, method: 'PUT' }),
            invalidatesTags: ['User'],
        }),
    }),
})

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useUpdateProfileMutation, useToggleWishlistMutation } = authApiSlice

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({ url: '/orders', method: 'POST', body: data }),
            invalidatesTags: ['Order'],
        }),
        getMyOrders: builder.query({
            query: () => '/orders/mine',
            providesTags: ['Order'],
        }),
        getOrder: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (r, e, id) => [{ type: 'Order', id }],
        }),
        payOrder: builder.mutation({
            query: ({ id, paymentResult }) => ({ url: `/orders/${id}/pay`, method: 'PUT', body: { paymentResult } }),
            invalidatesTags: ['Order'],
        }),
        getAllOrders: builder.query({
            query: (params) => ({ url: '/orders', params }),
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status, trackingNumber }) => ({ url: `/orders/${id}/status`, method: 'PUT', body: { status, trackingNumber } }),
            invalidatesTags: ['Order'],
        }),
    }),
})

export const { useCreateOrderMutation, useGetMyOrdersQuery, useGetOrderQuery, usePayOrderMutation, useGetAllOrdersQuery, useUpdateOrderStatusMutation } = ordersApiSlice

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (data) => ({ url: '/categories', method: 'POST', body: data }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/categories/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Category'],
        }),
    }),
})

export const { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoriesApiSlice

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/admin/stats',
        }),
        getAdminUsers: builder.query({
            query: (params) => ({ url: '/admin/users', params }),
            providesTags: ['User'],
        }),
        updateAdminUser: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/admin/users/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['User'],
        }),
        deleteAdminUser: builder.mutation({
            query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
            invalidatesTags: ['User'],
        }),
    }),
})

export const { useGetDashboardStatsQuery, useGetAdminUsersQuery, useUpdateAdminUserMutation, useDeleteAdminUserMutation } = adminApiSlice

export const paymentsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        confirmPayment: builder.mutation({
            query: (data) => ({ url: '/payments/confirm', method: 'POST', body: data }),
            invalidatesTags: ['Order'],
        }),
    }),
})

export const { useConfirmPaymentMutation } = paymentsApiSlice

