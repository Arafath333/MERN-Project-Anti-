import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useLoginMutation } from '../store/otherApiSlices'
import { setCredentials } from '../store/authSlice'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPw, setShowPw] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [login, { isLoading }] = useLoginMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await login(form).unwrap()
            dispatch(setCredentials(data.data))
            toast.success(`Welcome back, ${data.data.name}!`)
            navigate('/')
        } catch (err) {
            toast.error(err?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="flex-center" style={{ minHeight: '90vh', background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 60%), var(--bg-primary)', padding: '2rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your ArafathBuys account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Create one</Link>
                </p>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.15)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Demo credentials:</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>Admin: admin@example.com / admin123</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>User: john@example.com / user123</p>
                </div>
            </div>
        </div>
    )
}
