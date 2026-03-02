import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { productsAPI, categoriesAPI } from '../services/api'
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme'

const CATEGORY_ICONS = { electronics: '💻', fashion: '👗', 'home-living': '🏠', 'sports-fitness': '🏃', books: '📚', beauty: '💄' }

export default function HomeScreen({ navigation }) {
    const dispatch = useDispatch()
    const [featured, setFeatured] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [search, setSearch] = useState('')

    const fetchData = async () => {
        try {
            const [featRes, catRes] = await Promise.all([productsAPI.getFeatured(), categoriesAPI.getAll()])
            setFeatured(featRes.data.data || [])
            setCategories(catRes.data.data || [])
        } catch (e) { console.error(e) }
        setLoading(false)
        setRefreshing(false)
    }

    useEffect(() => { fetchData() }, [])

    const onRefresh = () => { setRefreshing(true); fetchData() }

    const handleSearch = () => {
        if (search.trim()) navigation.navigate('Products', { search: search.trim() })
    }

    const renderProduct = ({ item }) => {
        const discount = item.comparePrice > item.price ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100) : 0
        return (
            <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { product: item, id: item._id })}>
                <Image source={{ uri: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' }} style={styles.productImage} />
                {discount > 0 && (
                    <View style={styles.discountBadge}><Text style={styles.discountText}>-{discount}%</Text></View>
                )}
                <View style={styles.productInfo}>
                    <Text style={styles.productBrand} numberOfLines={1}>{item.brand || item.category?.name}</Text>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                        {item.comparePrice > item.price && <Text style={styles.comparePrice}>${item.comparePrice.toFixed(2)}</Text>}
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={() => dispatch(addToCart({ _id: item._id, name: item.name, price: item.price, image: item.images?.[0]?.url, stock: item.stock, quantity: 1 }))}>
                        <Text style={styles.addBtnText}>🛒 Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome to ⚡</Text>
                        <Text style={styles.logo}>ArafathBuys</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
                        <Text style={{ fontSize: 22 }}>🛒</Text>
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor={COLORS.textMuted}
                        value={search}
                        onChangeText={setSearch}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Go</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero Banner */}
                <View style={styles.heroBanner}>
                    <Text style={styles.heroBadge}>✨ New Arrivals Weekly</Text>
                    <Text style={styles.heroTitle}>Premium Picks,{'\n'}Curated for You</Text>
                    <TouchableOpacity style={styles.heroCta} onPress={() => navigation.navigate('Products', {})}>
                        <Text style={styles.heroCtaText}>Shop Now →</Text>
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                {categories.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                            {categories.map((cat) => (
                                <TouchableOpacity key={cat._id} style={styles.catChip} onPress={() => navigation.navigate('Products', { categoryId: cat._id, categoryName: cat.name })}>
                                    <Text style={styles.catIcon}>{CATEGORY_ICONS[cat.slug] || '🛍️'}</Text>
                                    <Text style={styles.catName}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Featured Products */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Featured</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Products', {})}><Text style={styles.seeAll}>See All →</Text></TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
                    ) : (
                        <FlatList
                            data={featured}
                            renderItem={renderProduct}
                            keyExtractor={(i) => i._id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.productList}
                        />
                    )}
                </View>

                {/* Promo */}
                <View style={styles.promoBanner}>
                    <Text style={styles.promoTag}>LIMITED OFFER</Text>
                    <Text style={styles.promoTitle}>Get 20% Off</Text>
                    <Text style={styles.promoSub}>Use code <Text style={{ color: COLORS.primary, fontWeight: '700' }}>WELCOME20</Text></Text>
                    <TouchableOpacity style={styles.promoCta} onPress={() => navigation.navigate('Products', {})}><Text style={styles.promoCtaText}>Shop Now</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, paddingTop: SPACING.sm },
    greeting: { color: COLORS.textMuted, fontSize: 13 },
    logo: { fontSize: 26, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
    cartBtn: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
    searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
    searchInput: { flex: 1, backgroundColor: COLORS.bgElevated, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
    searchBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, alignItems: 'center', justifyContent: 'center' },
    heroBanner: { margin: SPACING.md, borderRadius: RADIUS.xl, padding: SPACING.lg, background: COLORS.bgCard, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)', overflow: 'hidden' },
    heroBadge: { color: COLORS.primary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    heroTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md, lineHeight: 30 },
    heroCta: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 10, paddingHorizontal: 24, alignSelf: 'flex-start' },
    heroCtaText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    section: { paddingHorizontal: SPACING.md, marginBottom: SPACING.lg },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
    seeAll: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
    catScroll: { marginHorizontal: -SPACING.md, paddingHorizontal: SPACING.md },
    catChip: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: SPACING.sm, marginRight: SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, minWidth: 80 },
    catIcon: { fontSize: 22, marginBottom: 4 },
    catName: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600', textAlign: 'center' },
    productList: { paddingRight: SPACING.md },
    productCard: { width: 180, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, overflow: 'hidden', marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
    productImage: { width: '100%', height: 160, resizeMode: 'cover' },
    discountBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: COLORS.success, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
    discountText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    productInfo: { padding: SPACING.sm },
    productBrand: { color: COLORS.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    productName: { color: COLORS.text, fontSize: 13, fontWeight: '600', marginBottom: 6, lineHeight: 18 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    price: { color: COLORS.text, fontSize: 15, fontWeight: '800' },
    comparePrice: { color: COLORS.textMuted, fontSize: 12, textDecorationLine: 'line-through' },
    addBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 7, alignItems: 'center' },
    addBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    promoBanner: { margin: SPACING.md, borderRadius: RADIUS.xl, padding: SPACING.lg, backgroundColor: 'rgba(124,58,237,0.15)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)', marginBottom: SPACING.xl, alignItems: 'center' },
    promoTag: { color: COLORS.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
    promoTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
    promoSub: { color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.md },
    promoCta: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 12, paddingHorizontal: 32 },
    promoCtaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
