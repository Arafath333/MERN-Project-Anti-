import { useState } from 'react'
import { AdminLayout } from './AdminDashboard'
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../store/otherApiSlices'
import toast from 'react-hot-toast'

const STATUS_COLORS = { pending: 'warning', processing: 'info', shipped: 'purple', delivered: 'success', cancelled: 'error', refunded: 'error' }

export default function AdminOrders() {
    const [page, setPage] = useState(1)
    const { data, isLoading } = useGetAllOrdersQuery({ page, limit: 20 })
    const [updateStatus] = useUpdateOrderStatusMutation()

    const orders = data?.data || []
    const total = data?.total || 0

    const handleStatusChange = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap()
            toast.success('Order status updated')
        } catch { toast.error('Failed to update status') }
    }

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Orders ({total})</h1>
            </div>

            {isLoading ? <div className="loading-container"><div className="spinner" /></div> : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th>
                                <th>Total</th><th>Paid</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>#{order._id.slice(-8)}</td>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{order.user?.name || '—'}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>{order.orderItems?.length}</td>
                                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${order.totalPrice?.toFixed(2)}</td>
                                    <td><span className={`badge badge-${order.isPaid ? 'success' : 'warning'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span></td>
                                    <td><span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`}>{order.orderStatus}</span></td>
                                    <td>
                                        <select
                                            className="form-input"
                                            style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: 130 }}
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        >
                                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {Math.ceil(total / 20) > 1 && (
                <div className="pagination" style={{ marginTop: '2rem' }}>
                    <button className="pagination-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span style={{ padding: '0.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Page {page} of {Math.ceil(total / 20)}</span>
                    <button className="pagination-btn" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}
        </AdminLayout>
    )
}
