import React from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice'
import { COLORS, SPACING, RADIUS } from '../constants/theme'

export default function CartScreen({ navigation }) {
    const dispatch = useDispatch()
    const { cartItems } = useSelector((s) => s.cart)
    const { userInfo } = useSelector((s) => s.auth)

    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal >= 50 ? 0 : 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    if (cartItems.length === 0) return (
        <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 60, marginBottom: 16 }}>🛒</Text>
            <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Cart is empty</Text>
            <Text style={{ color: COLORS.textMuted, marginBottom: 24 }}>Start shopping to add items</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Products')}>
                <Text style={styles.shopBtnTxt}>Start Shopping</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}><Text style={styles.title}>Cart ({cartItems.length})</Text></View>
            <FlatList
                data={cartItems}
                keyExtractor={(i) => i._id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200' }} style={styles.image} />
                        <View style={styles.info}>
                            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                            <View style={styles.qtyRow}>
                                <TouchableOpacity onPress={() => { if (item.quantity === 1) dispatch(removeFromCart(item._id)); else dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 })) }} style={styles.qtyBtn}><Text style={styles.qtyBtnTxt}>−</Text></TouchableOpacity>
                                <Text style={styles.qty}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))} style={styles.qtyBtn}><Text style={styles.qtyBtnTxt}>+</Text></TouchableOpacity>
                                <Text style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => dispatch(removeFromCart(item._id))} style={styles.removeBtn}><Text style={{ color: COLORS.error, fontSize: 18 }}>✕</Text></TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
                ListFooterComponent={
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>
                        {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`], ['Tax', `$${tax.toFixed(2)}`]].map(([k, v]) => (
                            <View key={k} style={styles.summaryRow}><Text style={styles.summaryKey}>{k}</Text><Text style={styles.summaryVal}>{v}</Text></View>
                        ))}
                        <View style={[styles.summaryRow, styles.totalRow]}><Text style={styles.totalKey}>Total</Text><Text style={styles.totalVal}>${total.toFixed(2)}</Text></View>
                        <TouchableOpacity style={styles.checkoutBtn} onPress={() => userInfo ? navigation.navigate('Main') : navigation.navigate('Login')}>
                            <Text style={styles.checkoutTxt}>{userInfo ? '✓ Proceed to Checkout' : 'Login to Checkout'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => dispatch(clearCart())} style={styles.clearBtn}><Text style={styles.clearTxt}>Clear Cart</Text></TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    header: { padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
    item: { flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm, alignItems: 'center' },
    image: { width: 80, height: 80, borderRadius: RADIUS.md, resizeMode: 'cover' },
    info: { flex: 1 },
    name: { color: COLORS.text, fontSize: 13, fontWeight: '600', marginBottom: 4 },
    price: { color: COLORS.primary, fontSize: 15, fontWeight: '700', marginBottom: 6 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    qtyBtn: { width: 28, height: 28, borderRadius: RADIUS.full, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
    qtyBtnTxt: { color: COLORS.text, fontSize: 16, fontWeight: '700', lineHeight: 18 },
    qty: { color: COLORS.text, fontWeight: '700', minWidth: 20, textAlign: 'center' },
    subtotal: { color: COLORS.text, fontWeight: '700', marginLeft: 'auto' },
    removeBtn: { padding: 4 },
    summaryCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
    summaryTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    summaryKey: { color: COLORS.textSecondary, fontSize: 14 },
    summaryVal: { color: COLORS.text, fontSize: 14, fontWeight: '500' },
    totalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, marginTop: 4 },
    totalKey: { color: COLORS.text, fontWeight: '700', fontSize: 16 },
    totalVal: { color: COLORS.primary, fontWeight: '800', fontSize: 18 },
    checkoutBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center', marginTop: SPACING.md },
    checkoutTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
    clearBtn: { alignItems: 'center', marginTop: SPACING.sm, paddingVertical: 8 },
    clearTxt: { color: COLORS.error, fontSize: 13 },
    shopBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 14, paddingHorizontal: 32 },
    shopBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
