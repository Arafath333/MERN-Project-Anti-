import { Link } from 'react-router-dom'
import { FiPackage } from 'react-icons/fi'
import { useGetMyOrdersQuery } from '../store/otherApiSlices'

const STATUS_COLORS = { pending: 'warning', processing: 'info', shipped: 'purple', delivered: 'success', cancelled: 'error' }

export default function OrderHistoryPage() {
    const { data, isLoading } = useGetMyOrdersQuery()
    const orders = data?.data || []

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <div className="page-header">
                <div className="container">
                    <h1>My Orders</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{orders.length} order(s) found</p>
                </div>
            </div>
            <div className="container" style={{ paddingBottom: '4rem' }}>
                {isLoading ? (
                    <div className="loading-container"><div className="spinner" /></div>
                ) : orders.length === 0 ? (
                    <div className="flex-center" style={{ flexDirection: 'column', gap: '1.5rem', padding: '5rem 0' }}>
                        <FiPackage size={64} color="var(--text-muted)" />
                        <h2>No orders yet</h2>
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--accent-secondary)', fontSize: '0.85rem' }}>#{order._id.slice(-8)}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{order.orderItems?.length || 0} item(s)</td>
                                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${order.totalPrice?.toFixed(2)}</td>
                                        <td><span className={`badge badge-${order.isPaid ? 'success' : 'warning'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span></td>
                                        <td><span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`}>{order.orderStatus}</span></td>
                                        <td><Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">View →</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
