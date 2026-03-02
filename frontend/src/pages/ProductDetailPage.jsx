import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiStar, FiCheck, FiTruck, FiShield } from 'react-icons/fi'
import { useGetProductQuery } from '../store/productsApiSlice'
import { useAddReviewMutation } from '../store/productsApiSlice'
import { addToCart } from '../store/cartSlice'
import { StarRating } from '../components/ProductCard'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { userInfo } = useSelector((s) => s.auth)
    const [qty, setQty] = useState(1)
    const [activeImg, setActiveImg] = useState(0)
    const [activeTab, setActiveTab] = useState('description')
    const [review, setReview] = useState({ rating: 5, title: '', comment: '' })

    const { data, isLoading, isError } = useGetProductQuery(id)
    const [addReview, { isLoading: reviewLoading }] = useAddReviewMutation()

    const product = data?.data

    if (isLoading) return (
        <div className="loading-container" style={{ minHeight: '60vh' }}>
            <div className="spinner" style={{ width: 60, height: 60 }} />
        </div>
    )

    if (isError || !product) return (
        <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '6rem 0' }}>
            <div style={{ fontSize: '4rem' }}>😕</div>
            <h2>Product not found</h2>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
    )

    const discount = product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0

    const handleAddToCart = () => {
        dispatch(addToCart({ _id: product._id, name: product.name, price: product.price, image: product.images?.[0]?.url || '', stock: product.stock, quantity: qty }))
        toast.success(`${product.name} added to cart!`)
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        if (!userInfo) { toast.error('Please login to review'); return }
        try {
            await addReview({ productId: product._id, ...review }).unwrap()
            toast.success('Review submitted!')
            setReview({ rating: 5, title: '', comment: '' })
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to submit review')
        }
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link> /
                    <Link to="/products" style={{ color: 'var(--text-muted)' }}>Products</Link> /
                    <Link to={`/products?category=${product.category?._id}`} style={{ color: 'var(--text-muted)' }}>{product.category?.name}</Link> /
                    <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                </div>

                {/* Product Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
                    {/* Images */}
                    <div>
                        <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--bg-elevated)', aspectRatio: '1/1', marginBottom: '1rem', position: 'relative' }}>
                            <img src={product.images?.[activeImg]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {discount > 0 && <div style={{ position: 'absolute', top: 16, left: 16 }}><span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>-{discount}% OFF</span></div>}
                        </div>
                        {product.images?.length > 1 && (
                            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {product.images.map((img, i) => (
                                    <div key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImg === i ? 'var(--accent-primary)' : 'var(--border)'}`, flexShrink: 0, transition: 'var(--transition)' }}>
                                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {product.brand && <span className="badge badge-purple">{product.brand}</span>}
                            <span className="badge badge-info">{product.category?.name}</span>
                            {product.stock > 0 ? <span className="badge badge-success"><FiCheck size={10} /> In Stock ({product.stock})</span> : <span className="badge badge-error">Out of Stock</span>}
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '1rem' }}>{product.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <StarRating rating={product.ratings} numReviews={product.numReviews} />
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>|</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{product.numReviews} reviews</span>
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>${product.price.toFixed(2)}</span>
                            {product.comparePrice > product.price && (
                                <>
                                    <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${product.comparePrice.toFixed(2)}</span>
                                    <span className="badge badge-success" style={{ fontSize: '0.9rem' }}>Save ${(product.comparePrice - product.price).toFixed(2)}</span>
                                </>
                            )}
                        </div>

                        {product.shortDescription && <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.shortDescription}</p>}

                        {/* Qty + Cart */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem' }}><FiMinus /></button>
                                <span style={{ padding: '0 1rem', fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{qty}</span>
                                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.1rem' }}><FiPlus /></button>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock === 0} style={{ flex: 1 }}>
                                <FiShoppingCart /> Add to Cart
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                            <button className="btn btn-ghost" style={{ flex: 1 }}><FiHeart /> Wishlist</button>
                            <button className="btn btn-ghost"><FiShare2 /> Share</button>
                        </div>

                        {/* Trust */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                [FiTruck, 'Free shipping on orders over $50'],
                                [FiShield, '30-day hassle-free returns'],
                                [FiCheck, '2-year warranty included'],
                            ].map(([Icon, text]) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <Icon size={16} color="var(--success)" /> {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                        {['description', 'specifications', 'reviews'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === tab ? 'var(--accent-secondary)' : 'var(--text-muted)', borderBottom: `2px solid ${activeTab === tab ? 'var(--accent-primary)' : 'transparent'}`, fontWeight: activeTab === tab ? 600 : 400, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', textTransform: 'capitalize', transition: 'var(--transition)', marginBottom: -1 }}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'description' && (
                        <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 700 }}>{product.description}</div>
                    )}

                    {activeTab === 'specifications' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                            {product.specifications?.map((spec, i) => (
                                <div key={i} style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{spec.key}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', textAlign: 'right' }}>{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                            {/* Review List */}
                            <div>
                                {product.reviews?.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {product.reviews?.map((rev) => (
                                            <div key={rev._id} style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                                                        {rev.user?.name?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rev.user?.name}</div>
                                                        <StarRating rating={rev.rating} />
                                                    </div>
                                                    {rev.title && <span style={{ marginLeft: 'auto', fontWeight: 600, fontSize: '0.875rem' }}>{rev.title}</span>}
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rev.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add Review */}
                            <div>
                                <h3 style={{ marginBottom: '1.5rem' }}>Write a Review</h3>
                                {!userInfo ? (
                                    <p>Please <Link to="/login">login</Link> to write a review.</p>
                                ) : (
                                    <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Rating</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {[1, 2, 3, 4, 5].map(r => (
                                                    <button key={r} type="button" onClick={() => setReview(p => ({ ...p, rating: r }))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: r <= review.rating ? 'var(--warning)' : 'var(--text-muted)' }}>★</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Title</label>
                                            <input className="form-input" placeholder="Summary" value={review.title} onChange={e => setReview(p => ({ ...p, title: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Review *</label>
                                            <textarea className="form-input" rows={4} placeholder="Share your experience..." value={review.comment} onChange={e => setReview(p => ({ ...p, comment: e.target.value }))} required />
                                        </div>
                                        <button className="btn btn-primary" type="submit" disabled={reviewLoading}>
                                            {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
