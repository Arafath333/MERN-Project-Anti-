import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ordersAPI } from '../services/api'
import { COLORS, SPACING, RADIUS } from '../constants/theme'

const STATUS_COLORS = { pending: COLORS.warning, processing: COLORS.info, delivered: COLORS.success, cancelled: COLORS.error, shipped: COLORS.primary }

export default function OrderHistoryScreen({ navigation }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ordersAPI.getMine().then(r => setOrders(r.data.data || [])).catch(console.error).finally(() => setLoading(false))
    }, [])

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Text style={{ color: COLORS.text, fontSize: 20 }}>←</Text></TouchableOpacity>
                <Text style={styles.title}>My Orders</Text>
            </View>
            {loading ? <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} /> : (
                <FlatList
                    data={orders}
                    keyExtractor={(i) => i._id}
                    contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
                    ListEmptyComponent={() => (
                        <View style={{ alignItems: 'center', paddingTop: 60 }}>
                            <Text style={{ fontSize: 50, marginBottom: 12 }}>📭</Text>
                            <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>No orders yet</Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <View>
                                    <Text style={styles.orderId}>Order #{item._id.slice(-8)}</Text>
                                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()} · {item.orderItems?.length} item(s)</Text>
                                </View>
                                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.orderStatus] + '20', borderColor: STATUS_COLORS[item.orderStatus] + '40' }]}>
                                    <Text style={[styles.badgeTxt, { color: STATUS_COLORS[item.orderStatus] }]}>{item.orderStatus}</Text>
                                </View>
                            </View>
                            <View style={styles.footer}>
                                <View>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.total}>${item.totalPrice?.toFixed(2)}</Text>
                                </View>
                                <View style={styles.rightBadges}>
                                    <View style={[styles.badge, { backgroundColor: item.isPaid ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', borderColor: item.isPaid ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)' }]}>
                                        <Text style={[styles.badgeTxt, { color: item.isPaid ? COLORS.success : COLORS.warning }]}>{item.isPaid ? '✓ Paid' : '⏳ Unpaid'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    back: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
    title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
    card: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
    orderId: { color: COLORS.text, fontWeight: '700', fontSize: 14, marginBottom: 4 },
    date: { color: COLORS.textMuted, fontSize: 12 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, borderWidth: 1 },
    badgeTxt: { fontSize: 11, fontWeight: '700' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
    totalLabel: { color: COLORS.textMuted, fontSize: 12 },
    total: { color: COLORS.text, fontWeight: '800', fontSize: 18 },
    rightBadges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
})
