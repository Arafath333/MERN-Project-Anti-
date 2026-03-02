import { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi'
import { AdminLayout } from './AdminDashboard'
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../../store/productsApiSlice'
import { useGetCategoriesQuery } from '../../store/otherApiSlices'
import toast from 'react-hot-toast'

const EMPTY = { name: '', description: '', shortDescription: '', price: '', comparePrice: '', category: '', brand: '', stock: '', isFeatured: false, images: [] }

export default function AdminProducts() {
    const [modal, setModal] = useState(null) // null | 'create' | productObj
    const [form, setForm] = useState(EMPTY)
    const [page, setPage] = useState(1)

    const { data, isLoading, refetch } = useGetProductsQuery({ page, limit: 15 })
    const { data: catsData } = useGetCategoriesQuery()
    const [createProduct, { isLoading: creating }] = useCreateProductMutation()
    const [updateProduct, { isLoading: updating }] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()

    const products = data?.data || []
    const categories = catsData?.data || []

    const openCreate = () => { setForm(EMPTY); setModal('create') }
    const openEdit = (p) => {
        setForm({ name: p.name, description: p.description, shortDescription: p.shortDescription || '', price: p.price, comparePrice: p.comparePrice || '', category: p.category?._id || '', brand: p.brand || '', stock: p.stock, isFeatured: p.isFeatured, images: p.images || [] })
        setModal(p)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = { ...form, price: Number(form.price), comparePrice: Number(form.comparePrice) || 0, stock: Number(form.stock) }
            if (modal === 'create') {
                await createProduct(payload).unwrap()
                toast.success('Product created!')
            } else {
                await updateProduct({ id: modal._id, ...payload }).unwrap()
                toast.success('Product updated!')
            }
            setModal(null)
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to save product')
        }
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"?`)) return
        try {
            await deleteProduct(id).unwrap()
            toast.success('Product deleted')
        } catch { toast.error('Failed to delete') }
    }

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Products ({data?.total || 0})</h1>
                <button className="btn btn-primary" onClick={openCreate}><FiPlus /> New Product</button>
            </div>

            {isLoading ? <div className="loading-container"><div className="spinner" /></div> : (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id}>
                                    <td><img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80'} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /></td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 200 }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span></td>
                                    <td>{p.category?.name || '—'}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${p.price}</td>
                                    <td><span className={`badge badge-${p.stock > 0 ? 'success' : 'error'}`}>{p.stock}</span></td>
                                    <td>{p.isFeatured ? <FiCheck color="var(--success)" /> : <FiX color="var(--text-muted)" />}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(p)} title="Edit"><FiEdit2 size={14} /></button>
                                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p._id, p.name)} title="Delete"><FiTrash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem' }}>{modal === 'create' ? 'New Product' : 'Edit Product'}</h2>
                            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setModal(null)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[['Name', 'name', 'text'], ['Brand', 'brand', 'text'], ['Price ($)', 'price', 'number'], ['Compare Price ($)', 'comparePrice', 'number'], ['Stock', 'stock', 'number']].map(([label, key, type]) => (
                                    <div key={key} className="form-group">
                                        <label className="form-label">{label}</label>
                                        <input type={type} className="form-input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={['name', 'price', 'stock'].includes(key)} min={type === 'number' ? 0 : undefined} />
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                                        <option value="">Select category</option>
                                        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Short Description</label>
                                <input className="form-input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Description *</label>
                                <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input className="form-input" placeholder="https://..." value={form.images?.[0]?.url || ''} onChange={(e) => setForm({ ...form, images: [{ url: e.target.value, public_id: '' }] })} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} style={{ accentColor: 'var(--accent-primary)', width: 18, height: 18 }} />
                                <label htmlFor="featured" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>Feature this product on homepage</label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={creating || updating} style={{ flex: 1 }}>
                                    {creating || updating ? 'Saving...' : modal === 'create' ? 'Create Product' : 'Update Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
