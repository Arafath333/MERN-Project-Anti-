import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi'
import { removeFromCart, updateCartQuantity } from '../store/cartSlice'

export default function CartPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cartItems } = useSelector((s) => s.cart)
    const { userInfo } = useSelector((s) => s.auth)

    const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = itemsTotal >= 50 ? 0 : 5.99
    const tax = itemsTotal * 0.08
    const total = itemsTotal + shipping + tax

    if (cartItems.length === 0) return (
        <div className="flex-center" style={{ flexDirection: 'column', gap: '1.5rem', padding: '8rem 0', background: 'var(--bg-primary)', minHeight: '70vh' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', border: '2px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiShoppingCart size={40} color="var(--accent-secondary)" />
            </div>
            <h2>Your cart is empty</h2>
            <p style={{ color: 'var(--text-muted)' }}>Add some awesome products!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
    )

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 0' }}>
            <div className="container">
                <h1 style={{ marginBottom: '2rem' }}>Shopping Cart <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1.2rem' }}>({cartItems.length} items)</span></h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cartItems.map((item) => (
                            <div key={item._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <img src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200'} alt={item.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Link to={`/products/${item._id}`} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>{item.name}</Link>
                                    <p style={{ color: 'var(--accent-secondary)', fontWeight: 700, fontSize: '1.1rem' }}>${item.price.toFixed(2)}</p>
                                </div>
                                {/* Qty */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <button onClick={() => dispatch(updateCartQuantity({ id: item._id, quantity: Math.max(1, item.quantity - 1) }))} style={{ padding: '0.6rem 0.875rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><FiMinus size={14} /></button>
                                    <span style={{ padding: '0 0.875rem', fontWeight: 600, minWidth: 36, textAlign: 'center', fontSize: '0.95rem' }}>{item.quantity}</span>
                                    <button onClick={() => dispatch(updateCartQuantity({ id: item._id, quantity: Math.min(item.stock, item.quantity + 1) }))} style={{ padding: '0.6rem 0.875rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><FiPlus size={14} /></button>
                                </div>
                                <div style={{ textAlign: 'right', minWidth: 80 }}>
                                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <button className="btn btn-danger btn-sm btn-icon" onClick={() => dispatch(removeFromCart(item._id))} title="Remove item">
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))}

                        <div style={{ textAlign: 'right' }}>
                            <Link to="/products" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Continue Shopping</Link>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="glass-card" style={{ padding: '1.75rem', position: 'sticky', top: 90 }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                            {[
                                ['Subtotal', `$${itemsTotal.toFixed(2)}`],
                                ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`],
                                ['Tax (8%)', `$${tax.toFixed(2)}`],
                            ].map(([label, val]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <span>{label}</span>
                                    <span style={{ color: label === 'Shipping' && shipping === 0 ? 'var(--success)' : 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
                                </div>
                            ))}
                            {itemsTotal < 50 && (
                                <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--success)' }}>
                                    Add ${(50 - itemsTotal).toFixed(2)} more for free shipping!
                                </div>
                            )}
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Total</span>
                                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <input type="text" placeholder="Promo code" className="form-input" style={{ fontSize: '0.875rem' }} />
                            <button className="btn btn-primary w-full" onClick={() => userInfo ? navigate('/checkout') : navigate('/login')}>
                                Proceed to Checkout <FiArrowRight />
                            </button>
                            {!userInfo && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>You need to <Link to="/login">login</Link> to checkout</p>}
                        </div>

                        {/* Accepted payments */}
                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Secure checkout powered by</p>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <span>💳 Visa</span><span>💳 Mastercard</span><span>💳 Stripe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
