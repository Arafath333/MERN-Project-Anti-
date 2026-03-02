import { Link, useParams } from 'react-router-dom'
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi'
import { useGetOrderQuery } from '../store/otherApiSlices'

export default function OrderSuccessPage() {
    const { id } = useParams()
    const { data, isLoading } = useGetOrderQuery(id)
    const order = data?.data

    return (
        <div className="flex-center" style={{ flexDirection: 'column', gap: '1.5rem', padding: '6rem 2rem', background: 'var(--bg-primary)', minHeight: '80vh', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.5s ease' }}>
                <FiCheckCircle size={48} color="var(--success)" />
            </div>
            <div>
                <h1 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Order Placed!</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Thank you for your purchase. We're preparing your order.</p>
            </div>
            {order && (
                <div className="glass-card" style={{ padding: '1.5rem', maxWidth: 400, width: '100%', textAlign: 'left' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Order ID</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent-secondary)', marginBottom: '1rem' }}>{order._id}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${order.totalPrice?.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</span>
                        <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>{order.orderStatus}</span>
                    </div>
                </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to={`/orders/${id}`} className="btn btn-primary"><FiPackage /> View Order</Link>
                <Link to="/products" className="btn btn-ghost">Continue Shopping <FiArrowRight /></Link>
            </div>
        </div>
    )
}
