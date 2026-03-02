import { apiSlice } from './apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({ url: '/products', params }),
            providesTags: ['Product'],
        }),
        getFeaturedProducts: builder.query({
            query: () => '/products/featured',
            providesTags: ['Product'],
        }),
        getProduct: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
        getRelatedProducts: builder.query({
            query: (id) => `/products/${id}/related`,
        }),
        createProduct: builder.mutation({
            query: (data) => ({ url: '/products', method: 'POST', body: data }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Product'],
        }),
        getReviews: builder.query({
            query: (productId) => `/products/${productId}/reviews`,
            providesTags: ['Review'],
        }),
        addReview: builder.mutation({
            query: ({ productId, ...data }) => ({ url: `/products/${productId}/reviews`, method: 'POST', body: data }),
            invalidatesTags: ['Review', 'Product'],
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetFeaturedProductsQuery,
    useGetProductQuery,
    useGetRelatedProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetReviewsQuery,
    useAddReviewMutation,
} = productsApiSlice
