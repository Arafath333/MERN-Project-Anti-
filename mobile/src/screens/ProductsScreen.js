import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { productsAPI } from '../services/api'
import { COLORS, SPACING, RADIUS } from '../constants/theme'

export default function ProductsScreen({ navigation, route }) {
    const dispatch = useDispatch()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(route.params?.search || '')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const fetchProducts = async (pageNum = 1, reset = true) => {
        try {
            const params = { page: pageNum, limit: 12 }
            if (search) params.search = search
            if (route.params?.categoryId) params.category = route.params.categoryId
            const res = await productsAPI.getAll(params)
            const newProducts = res.data.data || []
            if (reset) setProducts(newProducts)
            else setProducts((p) => [...p, ...newProducts])
            setHasMore(pageNum < res.data.pages)
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    useEffect(() => { setPage(1); setLoading(true); fetchProducts(1, true) }, [search, route.params?.categoryId])

    const loadMore = () => { if (hasMore && !loading) { const next = page + 1; setPage(next); fetchProducts(next, false) } }

    const renderItem = ({ item }) => {
        const disc = item.comparePrice > item.price ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100) : 0
        return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { id: item._id })}>
                <Image source={{ uri: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' }} style={styles.image} />
                {disc > 0 && <View style={styles.disc}><Text style={styles.discTxt}>-{disc}%</Text></View>}
                <View style={styles.info}>
                    <Text style={styles.brand} numberOfLines={1}>{item.brand || item.category?.name}</Text>
                    <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                        {item.comparePrice > item.price && <Text style={styles.oldPrice}>${item.comparePrice.toFixed(2)}</Text>}
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={() => dispatch(addToCart({ _id: item._id, name: item.name, price: item.price, image: item.images?.[0]?.url, stock: item.stock, quantity: 1 }))}>
                        <Text style={styles.addTxt}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={{ color: COLORS.text, fontSize: 20 }}>←</Text></TouchableOpacity>
                <Text style={styles.title}>{route.params?.categoryName || 'All Products'}</Text>
            </View>
            <View style={styles.searchRow}>
                <TextInput style={styles.searchInput} placeholder="Search products..." placeholderTextColor={COLORS.textMuted} value={search} onChangeText={setSearch} returnKeyType="search" />
            </View>
            {loading && page === 1 ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(i) => i._id}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 12, paddingHorizontal: SPACING.md, marginBottom: 12 }}
                    contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={hasMore ? <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 16 }} /> : null}
                    ListEmptyComponent={<View style={{ alignItems: 'center', paddingTop: 60 }}><Text style={{ fontSize: 40 }}>🔍</Text><Text style={{ color: COLORS.textMuted, marginTop: 12 }}>No products found</Text></View>}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.md },
    backBtn: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
    title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
    searchRow: { paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
    searchInput: { backgroundColor: COLORS.bgElevated, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
    card: { flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
    image: { width: '100%', height: 160, resizeMode: 'cover' },
    disc: { position: 'absolute', top: 8, left: 8, backgroundColor: COLORS.success, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
    discTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
    info: { padding: SPACING.sm },
    brand: { color: COLORS.textMuted, fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
    name: { color: COLORS.text, fontSize: 12, fontWeight: '600', marginBottom: 6, lineHeight: 17 },
    price: { color: COLORS.text, fontSize: 14, fontWeight: '800' },
    oldPrice: { color: COLORS.textMuted, fontSize: 11, textDecorationLine: 'line-through' },
    addBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 6, alignItems: 'center' },
    addTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
})
