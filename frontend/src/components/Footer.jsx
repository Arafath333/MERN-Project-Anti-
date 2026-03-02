import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
    return (
        <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', paddingBottom: '3rem' }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>⚡</span>
                            <span className="text-gradient" style={{ fontSize: '1.35rem', fontWeight: 800 }}>ArafathBuys</span>
                        </Link>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Your premium destination for curated products across electronics, fashion, and lifestyle.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {[FiTwitter, FiInstagram, FiFacebook, FiGithub].map((Icon, i) => (
                                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-secondary)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Shop</h4>
                        {['All Products', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty'].map(item => (
                            <Link key={item} to={`/products?search=${item}`}
                                style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem', textDecoration: 'none', transition: 'var(--transition)' }}
                                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Account</h4>
                        {[['My Profile', '/profile'], ['My Orders', '/orders'], ['Wishlist', '/profile'], ['Cart', '/cart'], ['Login', '/login']].map(([label, path]) => (
                            <Link key={label} to={path}
                                style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem', textDecoration: 'none', transition: 'var(--transition)' }}
                                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Contact</h4>
                        {[
                            [FiMail, 'support@arafathbuys.com'],
                            [FiPhone, '+1 (555) 123-4567'],
                            [FiMapPin, '123 Commerce St, NY 10001'],
                        ].map(([Icon, text], i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <Icon size={16} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                                {text}
                            </div>
                        ))}
                        {/* Newsletter */}
                        <div style={{ marginTop: '1.5rem' }}>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Subscribe for deals</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="email" placeholder="your@email.com" className="form-input" style={{ flex: 1, padding: '0.6rem 0.875rem', fontSize: '0.85rem' }} />
                                <button className="btn btn-primary btn-sm">Go</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>© 2026 ArafathBuys. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map(item => (
                            <a key={item} href="#" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>{item}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
