import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { productsAPI } from '../services/api'
import { COLORS, SPACING, RADIUS } from '../constants/theme'

export default function ProductDetailScreen({ navigation, route }) {
    const dispatch = useDispatch()
    const { id } = route.params
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [qty, setQty] = useState(1)
    const [activeImg, setActiveImg] = useState(0)

    useEffect(() => {
        productsAPI.getById(id).then(res => { setProduct(res.data.data); setLoading(false) }).catch(() => setLoading(false))
    }, [id])

    if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}><ActivityIndicator size="large" color={COLORS.primary} /></View>
    if (!product) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}><Text style={{ color: COLORS.text }}>Product not found</Text></View>

    const discount = product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Text style={{ color: COLORS.text, fontSize: 20 }}>←</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.backBtn}><Text style={{ fontSize: 20 }}>🛒</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image */}
                <Image source={{ uri: product.images?.[activeImg]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600' }} style={styles.mainImage} />
                {product.images?.length > 1 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
                        {product.images.map((img, i) => (
                            <TouchableOpacity key={i} onPress={() => setActiveImg(i)}>
                                <Image source={{ uri: img.url }} style={[styles.thumb, activeImg === i && styles.thumbActive]} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                <View style={styles.content}>
                    <View style={styles.badges}>
                        {product.brand && <View style={styles.badge}><Text style={styles.badgeTxt}>{product.brand}</Text></View>}
                        {discount > 0 && <View style={[styles.badge, { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }]}><Text style={[styles.badgeTxt, { color: COLORS.success }]}>-{discount}%</Text></View>}
                        <View style={[styles.badge, product.stock > 0 ? { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' } : { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)' }]}>
                            <Text style={[styles.badgeTxt, { color: product.stock > 0 ? COLORS.success : COLORS.error }]}>{product.stock > 0 ? `✓ In Stock (${product.stock})` : 'Out of Stock'}</Text>
                        </View>
                    </View>

                    <Text style={styles.name}>{product.name}</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                        {product.comparePrice > product.price && <Text style={styles.oldPrice}>${product.comparePrice.toFixed(2)}</Text>}
                    </View>

                    <Text style={styles.descLabel}>Description</Text>
                    <Text style={styles.desc}>{product.description}</Text>

                    {product.specifications?.length > 0 && (
                        <>
                            <Text style={styles.descLabel}>Specifications</Text>
                            {product.specifications.map((spec, i) => (
                                <View key={i} style={styles.specRow}>
                                    <Text style={styles.specKey}>{spec.key}</Text>
                                    <Text style={styles.specVal}>{spec.value}</Text>
                                </View>
                            ))}
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.qtyControl}>
                    <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}><Text style={{ color: COLORS.text, fontSize: 18 }}>−</Text></TouchableOpacity>
                    <Text style={styles.qtyText}>{qty}</Text>
                    <TouchableOpacity onPress={() => setQty(Math.min(product.stock, qty + 1))} style={styles.qtyBtn}><Text style={{ color: COLORS.text, fontSize: 18 }}>+</Text></TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={[styles.addCartBtn, product.stock === 0 && { opacity: 0.5 }]}
                    onPress={() => { dispatch(addToCart({ _id: product._id, name: product.name, price: product.price, image: product.images?.[0]?.url, stock: product.stock, quantity: qty })); navigation.navigate('Cart') }}
                    disabled={product.stock === 0}
                >
                    <Text style={styles.addCartTxt}>{product.stock === 0 ? 'Out of Stock' : '🛒  Add to Cart'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.md },
    backBtn: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
    mainImage: { width: '100%', height: 300, resizeMode: 'cover', backgroundColor: COLORS.bgElevated },
    thumbScroll: { padding: SPACING.sm, paddingLeft: SPACING.md },
    thumb: { width: 64, height: 64, borderRadius: RADIUS.md, resizeMode: 'cover', marginRight: 8, borderWidth: 2, borderColor: 'transparent' },
    thumbActive: { borderColor: COLORS.primary },
    content: { padding: SPACING.md },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: SPACING.sm },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, backgroundColor: 'rgba(124,58,237,0.15)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)' },
    badgeTxt: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
    name: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm, lineHeight: 26 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
    price: { fontSize: 26, fontWeight: '800', color: COLORS.text },
    oldPrice: { fontSize: 16, color: COLORS.textMuted, textDecorationLine: 'line-through' },
    descLabel: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    desc: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: SPACING.md },
    specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    specKey: { color: COLORS.textMuted, fontSize: 13 },
    specVal: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
    bottomBar: { flexDirection: 'row', gap: 12, padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.bgCard },
    qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgElevated, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
    qtyBtn: { paddingHorizontal: 14, paddingVertical: 10 },
    qtyText: { paddingHorizontal: 12, color: COLORS.text, fontWeight: '700', fontSize: 16 },
    addCartBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
    addCartTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
