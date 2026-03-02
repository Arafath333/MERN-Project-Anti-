import { useState } from 'react'
import { AdminLayout } from './AdminDashboard'
import { useGetAdminUsersQuery, useUpdateAdminUserMutation, useDeleteAdminUserMutation } from '../../store/otherApiSlices'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminUsers() {
    const [page, setPage] = useState(1)
    const { data, isLoading } = useGetAdminUsersQuery({ page, limit: 20 })
    const [updateUser] = useUpdateAdminUserMutation()
    const [deleteUser] = useDeleteAdminUserMutation()

    const users = data?.data || []
    const total = data?.total || 0

    const toggleRole = async (user) => {
        try {
            await updateUser({ id: user._id, role: user.role === 'admin' ? 'user' : 'admin' }).unwrap()
            toast.success('User role updated')
        } catch { toast.error('Failed to update role') }
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`Deactivate user "${name}"?`)) return
        try {
            await deleteUser(id).unwrap()
            toast.success('User deactivated')
        } catch { toast.error('Failed') }
    }

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Users ({total})</h1>
            </div>

            {isLoading ? <div className="loading-container"><div className="spinner" /></div> : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>Avatar</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>
                                            {user.name?.[0] || 'U'}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><span className={`badge badge-${user.role === 'admin' ? 'purple' : 'info'}`}>{user.role}</span></td>
                                    <td style={{ fontSize: '0.85rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td><span className={`badge badge-${user.isActive ? 'success' : 'error'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => toggleRole(user)} title={`Make ${user.role === 'admin' ? 'user' : 'admin'}`}>
                                                <FiEdit2 size={13} /> {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                            </button>
                                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(user._id, user.name)} title="Deactivate">
                                                <FiTrash2 size={13} />
                                            </button>
                                        </div>
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
