import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { authAPI } from '../services/api'
import { COLORS, SPACING, RADIUS } from '../constants/theme'

export default function RegisterScreen({ navigation }) {
    const dispatch = useDispatch()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRegister = async () => {
        if (!form.name || !form.email || !form.password) { setError('Please fill all fields'); return }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
        setLoading(true); setError('')
        try {
            const res = await authAPI.register({ name: form.name, email: form.email, password: form.password })
            dispatch(setCredentials(res.data.data))
            navigation.goBack()
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration failed')
        }
        setLoading(false)
    }

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Text style={{ color: COLORS.text, fontSize: 20 }}>←</Text></TouchableOpacity>
                    <View style={styles.icon}><Text style={{ fontSize: 40 }}>🚀</Text></View>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.sub}>Join thousands of happy shoppers</Text>
                    {error ? <View style={styles.errorBox}><Text style={styles.errorTxt}>{error}</Text></View> : null}
                    <View style={styles.card}>
                        {[['👤 Name', 'name', 'default', false], ['📧 Email', 'email', 'email-address', false], ['🔒 Password', 'password', 'default', true], ['🔒 Confirm Password', 'confirmPassword', 'default', true]].map(([label, key, kb, secure]) => (
                            <View key={key} style={styles.formGroup}>
                                <Text style={styles.label}>{label}</Text>
                                <TextInput style={styles.input} placeholder={label.split(' ').slice(1).join(' ')} placeholderTextColor={COLORS.textMuted} value={form[key]} onChangeText={(v) => setForm({ ...form, [key]: v })} keyboardType={kb} secureTextEntry={secure} autoCapitalize={key === 'name' ? 'words' : 'none'} />
                            </View>
                        ))}
                        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
                            <Text style={styles.btnTxt}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: SPACING.md }}>
                        <Text style={{ color: COLORS.textSecondary, textAlign: 'center', fontSize: 14 }}>Already have an account? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Sign In</Text></Text>
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
})
