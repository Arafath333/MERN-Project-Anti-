import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { clearCart } from '../store/cartSlice'
import { ordersAPI } from '../services/api'
import { COLORS, SPACING, RADIUS } from '../constants/theme'

const STATUS_BADGE = { pending: COLORS.warning, processing: COLORS.info, delivered: COLORS.success, cancelled: COLORS.error, shipped: COLORS.primary }

export default function ProfileScreen({ navigation }) {
    const dispatch = useDispatch()
    const { userInfo } = useSelector((s) => s.auth)
    const { cartItems } = useSelector((s) => s.cart)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (userInfo) {
            setLoading(true)
            ordersAPI.getMine().then(r => setOrders(r.data.data || [])).catch(() => { }).finally(() => setLoading(false))
        }
    }, [userInfo])

    const handleLogout = () => { dispatch(logout()); dispatch(clearCart()) }

    if (!userInfo) return (
        <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center', padding: SPACING.md }]}>
            <Text style={{ fontSize: 60, marginBottom: 16 }}>👤</Text>
            <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Not logged in</Text>
            <Text style={{ color: COLORS.textMuted, marginBottom: 24, textAlign: 'center' }}>Sign in to view your profile, orders, and more</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}><Text style={styles.btnTxt}>Sign In</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary, marginTop: 12 }]} onPress={() => navigation.navigate('Register')}><Text style={[styles.btnTxt, { color: COLORS.primary }]}>Create Account</Text></TouchableOpacity>
        </SafeAreaView>
    )

    const totalSpent = orders.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0)

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}><Text style={styles.avatarTxt}>{userInfo.name[0]}</Text></View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.uname}>{userInfo.name}</Text>
                        <Text style={styles.uemail}>{userInfo.email}</Text>
                        <View style={styles.roleBadge}><Text style={styles.roleTxt}>{userInfo.role}</Text></View>
                    </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}><Text style={{ color: COLORS.error, fontWeight: '600', fontSize: 13 }}>Logout</Text></TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {[
                        ['Orders', orders.length, '📦'],
                        ['Delivered', orders.filter(o => o.orderStatus === 'delivered').length, '✅'],
                        ['Cart', cartItems.length, '🛒'],
                        ['Spent', `$${totalSpent.toFixed(0)}`, '💳'],
                    ].map(([label, val, icon]) => (
                        <View key={label} style={styles.statCard}>
                            <Text style={styles.statIcon}>{icon}</Text>
                            <Text style={styles.statVal}>{val}</Text>
                            <Text style={styles.statLabel}>{label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Access */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Access</Text>
                    {[
                        ['📦', 'My Orders', () => navigation.navigate('OrderHistory')],
                        ['🛒', 'My Cart', () => navigation.navigate('Cart')],
                        ['🏠', 'Shop Now', () => navigation.navigate('Products')],
                    ].map(([icon, label, onPress]) => (
                        <TouchableOpacity key={label} style={styles.menuItem} onPress={onPress}>
                            <Text style={styles.menuIcon}>{icon}</Text>
                            <Text style={styles.menuLabel}>{label}</Text>
                            <Text style={{ color: COLORS.textMuted, fontSize: 18 }}>→</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Orders */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    {loading ? <ActivityIndicator color={COLORS.primary} /> : orders.slice(0, 4).length === 0 ? (
                        <Text style={{ color: COLORS.textMuted, textAlign: 'center', padding: SPACING.lg }}>No orders yet</Text>
                    ) : (
                        orders.slice(0, 4).map((order) => (
                            <View key={order._id} style={styles.orderRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.orderId}>#{order._id.slice(-8)}</Text>
                                    <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <Text style={styles.orderTotal}>${order.totalPrice?.toFixed(2)}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: STATUS_BADGE[order.orderStatus] + '20', borderColor: STATUS_BADGE[order.orderStatus] + '40' }]}>
                                    <Text style={[styles.statusTxt, { color: STATUS_BADGE[order.orderStatus] }]}>{order.orderStatus}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.bgCard, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    avatar: { width: 64, height: 64, borderRadius: RADIUS.full, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
    avatarTxt: { color: '#fff', fontSize: 26, fontWeight: '800' },
    uname: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
    uemail: { color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
    roleBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(124,58,237,0.15)', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)' },
    roleTxt: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
    logoutBtn: { padding: SPACING.sm },
    statsRow: { flexDirection: 'row', padding: SPACING.md, gap: 10 },
    statCard: { flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    statIcon: { fontSize: 20, marginBottom: 4 },
    statVal: { color: COLORS.text, fontWeight: '800', fontSize: 15 },
    statLabel: { color: COLORS.textMuted, fontSize: 10, textAlign: 'center' },
    section: { padding: SPACING.md, marginBottom: SPACING.sm },
    sectionTitle: { color: COLORS.text, fontWeight: '700', fontSize: 16, marginBottom: SPACING.sm },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.sm, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
    menuIcon: { fontSize: 22 },
    menuLabel: { flex: 1, color: COLORS.text, fontWeight: '600', fontSize: 15 },
    orderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: SPACING.sm, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
    orderId: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
    orderDate: { color: COLORS.textMuted, fontSize: 11 },
    orderTotal: { color: COLORS.text, fontWeight: '700' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full, borderWidth: 1 },
    statusTxt: { fontSize: 11, fontWeight: '700' },
    btn: { width: '80%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
    btnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
