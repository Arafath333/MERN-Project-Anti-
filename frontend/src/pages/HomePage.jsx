import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiHeadphones, FiStar } from 'react-icons/fi'
import { useGetFeaturedProductsQuery } from '../store/productsApiSlice'
import { useGetCategoriesQuery } from '../store/otherApiSlices'
import ProductCard from '../components/ProductCard'

const categoryIcons = { electronics: '💻', fashion: '👗', 'home-living': '🏠', 'sports-fitness': '🏃', books: '📚', beauty: '💄' }

export default function HomePage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const { data: featuredData, isLoading: featLoading } = useGetFeaturedProductsQuery()
    const { data: catsData } = useGetCategoriesQuery()

    const featured = featuredData?.data || []
    const categories = catsData?.data || []

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }

    return (
        <div>
            {/* HERO */}
            <section style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center', background: 'radial-gradient(ellipse at 60% 50%, rgba(124,58,237,0.15) 0%, transparent 70%), var(--bg-primary)' }}>
                {/* Animated orbs */}
                <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', top: -100, right: -100, animation: 'pulse 4s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', bottom: 50, left: -100, animation: 'pulse 5s ease-in-out infinite reverse' }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem' }}>
                    <div style={{ maxWidth: 700 }}>
                        <div className="fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 'var(--radius-full)', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
                            <span style={{ color: 'var(--accent-secondary)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>✨ New arrivals each week</span>
                        </div>
                        <h1 className="fade-in" style={{ marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                            Shop the Future<br />
                            <span className="text-gradient">Curated for You</span>
                        </h1>
                        <p className="fade-in" style={{ fontSize: '1.2rem', maxWidth: 540, marginBottom: '2.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            Discover thousands of premium products in electronics, fashion, and lifestyle — delivered to your door with care.
                        </p>
                        <form onSubmit={handleSearch} className="fade-in" style={{ display: 'flex', gap: '0.75rem', maxWidth: 480, marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Search 10,000+ products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-input"
                                style={{ flex: 1, minWidth: 200 }}
                            />
                            <button type="submit" className="btn btn-primary">
                                <FiShoppingBag /> Explore
                            </button>
                        </form>
                        <div className="fade-in" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            {[['50K+', 'Products'], ['4.9★', 'Rating'], ['2-Day', 'Delivery'], ['24/7', 'Support']].map(([val, label]) => (
                                <div key={label}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{val}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BADGES */}
            <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {[
                            [FiTruck, 'Free Shipping', 'On orders over $50'],
                            [FiShield, 'Secure Payment', '256-bit SSL encryption'],
                            [FiHeadphones, '24/7 Support', 'Dedicated help team'],
                            [FiStar, 'Top Rated', '4.9/5 from 50K+ reviews'],
                        ].map(([Icon, title, sub]) => (
                            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={22} color="var(--accent-secondary)" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            {categories.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section-header text-center">
                            <div className="section-tag">Browse Categories</div>
                            <h2 className="section-title">Shop by Category</h2>
                            <p className="section-subtitle">Explore our curated selection across every lifestyle need</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                            {categories.map((cat) => (
                                <Link key={cat._id} to={`/products?category=${cat._id}`} style={{ textDecoration: 'none' }}>
                                    <div className="glass-card" style={{ padding: '1.75rem 1rem', textAlign: 'center', cursor: 'pointer' }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{categoryIcons[cat.slug] || '🛍️'}</div>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{cat.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.description}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FEATURED PRODUCTS */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="section-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div className="section-tag">Staff Picks</div>
                            <h2 className="section-title">Featured Products</h2>
                        </div>
                        <Link to="/products" className="btn btn-secondary">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    {featLoading ? (
                        <div className="grid-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                    <div className="skeleton" style={{ height: 220, marginBottom: 1 }} />
                                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div className="skeleton" style={{ height: 14, width: '60%' }} />
                                        <div className="skeleton" style={{ height: 18, width: '90%' }} />
                                        <div className="skeleton" style={{ height: 14, width: '40%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid-4">
                            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* PROMO BANNER */}
            <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(236,72,153,0.15) 100%)', borderTop: '1px solid rgba(124,58,237,0.2)', borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
                <div className="container text-center">
                    <div className="section-tag" style={{ marginBottom: '1rem' }}>Limited Offer</div>
                    <h2 style={{ marginBottom: '1rem', fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>Get 20% Off Your First Order</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Use code <strong style={{ color: 'var(--accent-secondary)' }}>WELCOME20</strong> at checkout</p>
                    <Link to="/products" className="btn btn-primary btn-lg">Start Shopping <FiArrowRight /></Link>
                </div>
            </section>
        </div>
    )
}
