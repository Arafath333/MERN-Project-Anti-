import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useRegisterMutation } from '../store/otherApiSlices'
import { setCredentials } from '../store/authSlice'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [showPw, setShowPw] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [register, { isLoading }] = useRegisterMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
        try {
            const data = await register({ name: form.name, email: form.email, password: form.password }).unwrap()
            dispatch(setCredentials(data.data))
            toast.success(`Welcome to ArafathBuys, ${data.data.name}!`)
            navigate('/')
        } catch (err) {
            toast.error(err?.data?.message || 'Registration failed')
        }
    }

    return (
        <div className="flex-center" style={{ minHeight: '90vh', background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 60%), var(--bg-primary)', padding: '2rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join thousands of happy shoppers</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[
                        { label: 'Full Name', key: 'name', type: 'text', icon: FiUser, placeholder: 'John Doe' },
                        { label: 'Email Address', key: 'email', type: 'email', icon: FiMail, placeholder: 'your@email.com' },
                    ].map(({ label, key, type, icon: Icon, placeholder }) => (
                        <div key={key} className="form-group">
                            <label className="form-label">{label}</label>
                            <div style={{ position: 'relative' }}>
                                <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type={type} className="form-input" placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required style={{ paddingLeft: '2.5rem' }} />
                            </div>
                        </div>
                    ))}

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Repeat your password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    )
}
