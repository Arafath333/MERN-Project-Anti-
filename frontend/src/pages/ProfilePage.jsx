import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiUser, FiPackage, FiHeart, FiEdit2, FiSave } from 'react-icons/fi'
import { useGetMeQuery, useUpdateProfileMutation } from '../store/otherApiSlices'
import { useGetMyOrdersQuery } from '../store/otherApiSlices'
import toast from 'react-hot-toast'

const STATUS_COLORS = { pending: 'warning', processing: 'info', shipped: 'purple', delivered: 'success', cancelled: 'error', refunded: 'error' }

export default function ProfilePage() {
    const { userInfo } = useSelector((s) => s.auth)
    const { data: meData } = useGetMeQuery()
    const { data: ordersData } = useGetMyOrdersQuery()
    const [updateProfile, { isLoading }] = useUpdateProfileMutation()
    const [editing, setEditing] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')
    const [form, setForm] = useState({ name: userInfo?.name || '', email: userInfo?.email || '', phone: '', address: { street: '', city: '', state: '', postalCode: '', country: 'US' } })

    const orders = ordersData?.data || []

    const handleSave = async () => {
        try {
            await updateProfile(form).unwrap()
            toast.success('Profile updated!')
            setEditing(false)
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update profile')
        }
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <div className="page-header">
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                            {userInfo?.name?.[0] || 'U'}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem' }}>{userInfo?.name}</h1>
                            <p style={{ color: 'var(--text-muted)' }}>{userInfo?.email} · <span className={`badge badge-${userInfo?.role === 'admin' ? 'purple' : 'info'}`}>{userInfo?.role}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 0, marginBottom: '2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '0.375rem', width: 'fit-content', border: '1px solid var(--border)' }}>
                    {[['profile', FiUser, 'Profile'], ['orders', FiPackage, `Orders (${orders.length})`]].map(([tab, Icon, label]) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-lg)', border: 'none', background: activeTab === tab ? 'var(--accent-primary)' : 'transparent', color: activeTab === tab ? '#fff' : 'var(--text-secondary)', fontFamily: 'Inter', fontWeight: activeTab === tab ? 600 : 400, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition)', whiteSpace: 'nowrap' }}>
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>

                {activeTab === 'profile' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem' }}>Personal Info</h2>
                                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(!editing)}>
                                    <FiEdit2 size={14} /> {editing ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { label: 'Full Name', key: 'name', type: 'text' },
                                    { label: 'Email', key: 'email', type: 'email' },
                                    { label: 'Phone', key: 'phone', type: 'tel' },
                                ].map(({ label, key, type }) => (
                                    <div key={key} className="form-group">
                                        <label className="form-label">{label}</label>
                                        {editing ? (
                                            <input type={type} className="form-input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                                        ) : (
                                            <p style={{ padding: '0.75rem 1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', color: form[key] ? 'var(--text-primary)' : 'var(--text-muted)' }}>{form[key] || 'Not set'}</p>
                                        )}
                                    </div>
                                ))}
                                {editing && (
                                    <button className="btn btn-primary" onClick={handleSave} disabled={isLoading} style={{ marginTop: '0.5rem' }}>
                                        <FiSave /> {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Account Stats</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    ['Total Orders', orders.length, '📦'],
                                    ['Delivered', orders.filter(o => o.orderStatus === 'delivered').length, '✅'],
                                    ['Pending', orders.filter(o => o.orderStatus === 'pending').length, '⏳'],
                                    ['Total Spent', `$${orders.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0).toFixed(2)}`, '💳'],
                                ].map(([label, value, icon]) => (
                                    <div key={label} style={{ padding: '1.25rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{icon}</div>
                                        <div style={{ fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-primary)' }}>{value}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        {orders.length === 0 ? (
                            <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '4rem 0' }}>
                                <div style={{ fontSize: '4rem' }}>📭</div>
                                <h3>No orders yet</h3>
                                <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {orders.map((order) => (
                                    <div key={order._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: 200 }}>
                                            <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>#{order._id.slice(-8)}</p>
                                            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.orderItems?.length} item(s)</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`}>{order.orderStatus}</span>
                                        <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${order.totalPrice?.toFixed(2)}</p>
                                        <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">Details →</Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
