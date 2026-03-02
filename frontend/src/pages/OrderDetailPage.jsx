import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiTruck } from 'react-icons/fi'
import { useGetOrderQuery } from '../store/otherApiSlices'

const STATUS_COLORS = { pending: 'warning', processing: 'info', shipped: 'purple', delivered: 'success', cancelled: 'error' }

export default function OrderDetailPage() {
    const { id } = useParams()
    const { data, isLoading } = useGetOrderQuery(id)
    const order = data?.data

    if (isLoading) return <div className="loading-container"><div className="spinner" /></div>
    if (!order) return <div className="flex-center" style={{ padding: '6rem 0' }}><h2>Order not found</h2></div>

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 0' }}>
            <div className="container">
                <Link to="/orders" className="btn btn-ghost btn-sm" style={{ marginBottom: '2rem' }}><FiArrowLeft /> Back to Orders</Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem' }}>Order Details</h1>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>#{order._id}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span className={`badge badge-${order.isPaid ? 'success' : 'warning'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>{order.isPaid ? '✓ Paid' : '⏳ Payment Pending'}</span>
                        <span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>{order.orderStatus}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Items */}
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Order Items</h3>
                            {order.orderItems?.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid var(--border)' }}>
                                    <img src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.name}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Shipping */}
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiTruck /> Shipping Address</h3>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>
                                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.shippingAddress?.fullName}</p>
                                <p>{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                                <p>{order.shippingAddress?.country}</p>
                                {order.shippingAddress?.phone && <p>📞 {order.shippingAddress.phone}</p>}
                            </div>
                            {order.trackingNumber && (
                                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.15)', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Tracking #: </span>
                                    <span style={{ color: 'var(--accent-secondary)', fontFamily: 'monospace' }}>{order.trackingNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Order Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            {[
                                ['Items', `$${order.itemsPrice?.toFixed(2)}`],
                                ['Shipping', order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`],
                                ['Tax', `$${order.taxPrice?.toFixed(2)}`],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span>{k}</span><span style={{ color: 'var(--text-primary)' }}>{v}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
                                <span style={{ fontWeight: 800, color: 'var(--accent-secondary)', fontSize: '1.1rem' }}>${order.totalPrice?.toFixed(2)}</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <p>Ordered: {new Date(order.createdAt).toLocaleString()}</p>
                            {order.paidAt && <p style={{ color: 'var(--success)' }}>Paid: {new Date(order.paidAt).toLocaleString()}</p>}
                            {order.deliveredAt && <p style={{ color: 'var(--success)' }}>Delivered: {new Date(order.deliveredAt).toLocaleString()}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
