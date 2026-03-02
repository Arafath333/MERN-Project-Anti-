import { Link } from 'react-router-dom'
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiArrowUpRight } from 'react-icons/fi'
import { useGetDashboardStatsQuery } from '../../store/otherApiSlices'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const STATUS_COLORS = { pending: 'warning', processing: 'info', delivered: 'success', cancelled: 'error', shipped: 'purple' }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function AdminLayout({ children }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Sidebar */}
            <aside style={{ width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '2rem 1rem', flexShrink: 0 }}>
                <div style={{ marginBottom: '2.5rem', paddingLeft: '0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 700 }}>Admin Panel</p>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {[
                        ['/admin', '📊', 'Dashboard'],
                        ['/admin/products', '📦', 'Products'],
                        ['/admin/orders', '🛒', 'Orders'],
                        ['/admin/users', '👥', 'Users'],
                        ['/', '🏠', 'View Store'],
                    ].map(([path, icon, label]) => (
                        <Link key={path} to={path} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                            {icon} {label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main style={{ flex: 1, padding: '2.5rem', overflow: 'auto', minWidth: 0 }}>{children}</main>
        </div>
    )
}

export default function AdminDashboard() {
    const { data, isLoading } = useGetDashboardStatsQuery()
    const stats = data?.data

    const chartData = stats?.monthlyRevenue?.map(m => ({
        name: MONTHS[m._id.month - 1],
        revenue: Math.round(m.revenue),
        orders: m.count,
    })) || []

    const statCards = [
        { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: FiDollarSign, color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FiPackage, color: 'var(--info)', bg: 'rgba(59,130,246,0.1)' },
        { label: 'Total Products', value: stats?.totalProducts || 0, icon: FiShoppingBag, color: 'var(--accent-secondary)', bg: 'rgba(124,58,237,0.1)' },
        { label: 'Registered Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
    ]

    return (
        <AdminLayout>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
            {isLoading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                            <div key={label} className="glass-card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{label}</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</p>
                                    </div>
                                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={22} color={color} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    {chartData.length > 0 && (
                        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Monthly Revenue (6 months)</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
                                    <Bar dataKey="revenue" fill="url(#gradient)" radius={[6, 6, 0, 0]} />
                                    <defs>
                                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7c3aed" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Recent Orders */}
                    <div className="glass-card" style={{ padding: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.1rem' }}>Recent Orders</h2>
                            <Link to="/admin/orders" className="btn btn-ghost btn-sm">View All <FiArrowUpRight /></Link>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                                <tbody>
                                    {stats?.recentOrders?.map((order) => (
                                        <tr key={order._id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>#{order._id.slice(-8)}</td>
                                            <td>{order.user?.name || 'N/A'}</td>
                                            <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${order.totalPrice?.toFixed(2)}</td>
                                            <td><span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'info'}`}>{order.orderStatus}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    )
}

export { AdminLayout }
