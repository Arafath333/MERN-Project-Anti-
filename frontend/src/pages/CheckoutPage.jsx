import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiMapPin, FiCreditCard, FiCheckCircle } from 'react-icons/fi'
import { useCreateOrderMutation } from '../store/otherApiSlices'
import { clearCart, saveShippingAddress } from '../store/cartSlice'
import toast from 'react-hot-toast'

const STEPS = ['Shipping', 'Review', 'Payment']
const PAYMENT_METHODS = [
    { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
    { id: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'Pay via direct bank transfer' },
]

export default function CheckoutPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cartItems } = useSelector((s) => s.cart)
    const [step, setStep] = useState(0)
    const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', state: '', postalCode: '', country: 'US', phone: '' })
    const [paymentMethod, setPaymentMethod] = useState('cod')

    const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation()

    const itemsTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const tax = itemsTotal * 0.08
    const shippingCost = itemsTotal >= 50 ? 0 : 5.99
    const total = itemsTotal + tax + shippingCost

    const handleShippingSubmit = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress(shipping))
        setStep(1)
    }

    const handlePlaceOrder = async () => {
        try {
            const orderData = {
                orderItems: cartItems.map((i) => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
                shippingAddress: shipping,
                paymentMethod,
                itemsPrice: itemsTotal,
                taxPrice: tax,
                shippingPrice: shippingCost,
                totalPrice: total,
            }
            const res = await createOrder(orderData).unwrap()
            dispatch(clearCart())
            navigate(`/order-success/${res.data._id}`)
        } catch (err) {
            toast.error(err?.data?.message || 'Order creation failed')
        }
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: 900 }}>
                <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>

                {/* Stepper */}
                <div style={{ display: 'flex', gap: 0, marginBottom: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    {STEPS.map((s, i) => (
                        <div key={s} style={{ flex: 1, padding: '1rem', textAlign: 'center', background: i === step ? 'rgba(124,58,237,0.15)' : 'transparent', borderRight: i < 2 ? '1px solid var(--border)' : 'none', transition: 'var(--transition)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: i < step ? 'var(--success)' : i === step ? 'var(--accent-primary)' : 'var(--bg-elevated)', border: `2px solid ${i <= step ? (i < step ? 'var(--success)' : 'var(--accent-primary)') : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 700, fontSize: '0.85rem', color: i <= step ? '#fff' : 'var(--text-muted)' }}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        {/* Step 0 — Shipping */}
                        {step === 0 && (
                            <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiMapPin color="var(--accent-secondary)" /> Shipping Address</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {[
                                        { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', col: 2 },
                                        { key: 'address', label: 'Street Address', placeholder: '123 Main St', col: 2 },
                                        { key: 'city', label: 'City', placeholder: 'New York', col: 1 },
                                        { key: 'state', label: 'State', placeholder: 'NY', col: 1 },
                                        { key: 'postalCode', label: 'ZIP Code', placeholder: '10001', col: 1 },
                                        { key: 'country', label: 'Country', placeholder: 'US', col: 1 },
                                        { key: 'phone', label: 'Phone', placeholder: '+1 555 0000', col: 2 },
                                    ].map(({ key, label, placeholder, col }) => (
                                        <div key={key} className="form-group" style={{ gridColumn: `span ${col}` }}>
                                            <label className="form-label">{label}</label>
                                            <input className="form-input" placeholder={placeholder} value={shipping[key]} onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })} required={key !== 'phone'} />
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>Continue to Review →</button>
                            </form>
                        )}

                        {/* Step 1 — Review */}
                        {step === 1 && (
                            <div>
                                <h2 style={{ marginBottom: '1.5rem' }}>📋 Review Your Order</h2>
                                {cartItems.map((item) => (
                                    <div key={item._id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                                        <img src={item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                                        </div>
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <p><strong style={{ color: 'var(--text-primary)' }}>Ship to:</strong> {shipping.fullName}, {shipping.address}, {shipping.city} {shipping.postalCode}, {shipping.country}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={() => setStep(2)} style={{ flex: 1 }}>Continue to Payment →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 2 — Payment Method */}
                        {step === 2 && (
                            <div>
                                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FiCreditCard color="var(--accent-secondary)" /> Choose Payment Method</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {PAYMENT_METHODS.map((method) => (
                                        <label key={method.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: `2px solid ${paymentMethod === method.id ? 'var(--accent-primary)' : 'var(--border)'}`, cursor: 'pointer', background: paymentMethod === method.id ? 'rgba(124,58,237,0.08)' : 'var(--bg-elevated)', transition: 'var(--transition)' }}>
                                            <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} style={{ accentColor: 'var(--accent-primary)', width: 18, height: 18 }} />
                                            <span style={{ fontSize: '1.75rem' }}>{method.icon}</span>
                                            <div>
                                                <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{method.label}</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{method.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div style={{ padding: '0.875rem', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.85rem', color: 'var(--success)', marginBottom: '1.5rem' }}>
                                    🔒 Your order details are secured and kept private
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                                    <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={orderLoading} style={{ flex: 1 }}>
                                        {orderLoading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Order Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                            {[['Items', `$${itemsTotal.toFixed(2)}`], ['Shipping', shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`], ['Tax', `$${tax.toFixed(2)}`]].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span>{k}</span><span style={{ color: 'var(--text-primary)' }}>{v}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
                                <span style={{ fontWeight: 800, color: 'var(--accent-secondary)', fontSize: '1.1rem' }}>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        {cartItems.slice(0, 3).map((i) => (
                            <div key={i._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <img src={i.image} alt={i.name} style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>×{i.quantity}</p>
                                </div>
                            </div>
                        ))}
                        {cartItems.length > 3 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>+{cartItems.length - 3} more items</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
