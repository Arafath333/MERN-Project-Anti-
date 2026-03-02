import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { authAPI } from '../services/api'
import { COLORS, SPACING, RADIUS } from '../constants/theme'

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async () => {
        if (!form.email || !form.password) { setError('Please fill all fields'); return }
        setLoading(true); setError('')
        try {
            const res = await authAPI.login(form)
            dispatch(setCredentials(res.data.data))
            navigation.goBack()
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed')
        }
        setLoading(false)
    }

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Text style={{ color: COLORS.text, fontSize: 20 }}>←</Text></TouchableOpacity>
                    <View style={styles.icon}><Text style={{ fontSize: 40 }}>⚡</Text></View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.sub}>Sign in to your ArafathBuys account</Text>

                    {error ? <View style={styles.errorBox}><Text style={styles.errorTxt}>{error}</Text></View> : null}

                    <View style={styles.card}>
                        {[['📧 Email', 'email', 'email-address', false], ['🔒 Password', 'password', 'default', true]].map(([label, key, kb, secure]) => (
                            <View key={key} style={styles.formGroup}>
                                <Text style={styles.label}>{label}</Text>
                                <TextInput style={styles.input} placeholder={label.split(' ')[1]} placeholderTextColor={COLORS.textMuted} value={form[key]} onChangeText={(v) => setForm({ ...form, [key]: v })} keyboardType={kb} secureTextEntry={secure} autoCapitalize="none" />
                            </View>
                        ))}
                        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
                            <Text style={styles.btnTxt}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.demoBox}>
                        <Text style={styles.demoTitle}>Demo credentials</Text>
                        <Text style={styles.demoTxt}>Admin: admin@example.com / admin123</Text>
                        <Text style={styles.demoTxt}>User: john@example.com / user123</Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: SPACING.md }}>
                        <Text style={{ color: COLORS.textSecondary, textAlign: 'center', fontSize: 14 }}>Don't have an account? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Sign Up</Text></Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    container: { padding: SPACING.md, alignItems: 'center' },
    back: { alignSelf: 'flex-start', marginBottom: SPACING.lg, padding: 4 },
    icon: { width: 80, height: 80, borderRadius: RADIUS.full, backgroundColor: 'rgba(124,58,237,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
    sub: { color: COLORS.textMuted, marginBottom: SPACING.lg, textAlign: 'center' },
    errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', width: '100%' },
    errorTxt: { color: COLORS.error, fontSize: 13 },
    card: { width: '100%', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
    formGroup: { marginBottom: SPACING.md },
    label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 6 },
    input: { backgroundColor: COLORS.bgElevated, borderRadius: RADIUS.md, padding: SPACING.sm, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
    btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center', marginTop: SPACING.sm },
    btnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
    demoBox: { width: '100%', marginTop: SPACING.md, backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: RADIUS.md, padding: SPACING.sm, borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)' },
    demoTitle: { color: COLORS.textMuted, fontSize: 12, marginBottom: 4 },
    demoTxt: { color: COLORS.textSecondary, fontSize: 12 },
})
