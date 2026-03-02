import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings, FiHeart } from 'react-icons/fi'
import { logout } from '../store/authSlice'
import { clearCart } from '../store/cartSlice'
import toast from 'react-hot-toast'
import './Navbar.css'

export default function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userInfo } = useSelector((s) => s.auth)
    const { cartItems } = useSelector((s) => s.cart)
    const [menuOpen, setMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/')
        toast.success('Logged out successfully')
        setUserMenuOpen(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
            setMenuOpen(false)
        }
    }

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <span className="navbar__logo-icon">⚡</span>
                        <span className="text-gradient">ArafathBuys</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="navbar__links hide-mobile">
                        <Link to="/" className="navbar__link">Home</Link>
                        <Link to="/products" className="navbar__link">Products</Link>
                        <Link to="/products?category=electronics" className="navbar__link">Electronics</Link>
                        <Link to="/products?category=fashion" className="navbar__link">Fashion</Link>
                    </div>

                    {/* Search */}
                    <form className="navbar__search hide-mobile" onSubmit={handleSearch}>
                        <FiSearch className="navbar__search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="navbar__search-input"
                        />
                    </form>

                    {/* Actions */}
                    <div className="navbar__actions">
                        {/* Cart */}
                        <Link to="/cart" className="navbar__icon-btn">
                            <FiShoppingCart size={20} />
                            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
                        </Link>

                        {/* User */}
                        {userInfo ? (
                            <div className="navbar__user" style={{ position: 'relative' }}>
                                <button className="navbar__user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                                    {userInfo.avatar ? (
                                        <img src={userInfo.avatar} alt={userInfo.name} className="navbar__avatar" />
                                    ) : (
                                        <div className="navbar__avatar-placeholder">{userInfo.name[0]}</div>
                                    )}
                                </button>
                                {userMenuOpen && (
                                    <div className="navbar__dropdown">
                                        <div className="navbar__dropdown-header">
                                            <p className="navbar__dropdown-name">{userInfo.name}</p>
                                            <p className="navbar__dropdown-email">{userInfo.email}</p>
                                        </div>
                                        <div className="navbar__dropdown-divider" />
                                        <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                            <FiUser size={16} /> Profile
                                        </Link>
                                        <Link to="/orders" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                            <FiPackage size={16} /> My Orders
                                        </Link>
                                        {userInfo.role === 'admin' && (
                                            <>
                                                <div className="navbar__dropdown-divider" />
                                                <Link to="/admin" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                                    <FiSettings size={16} /> Admin Dashboard
                                                </Link>
                                            </>
                                        )}
                                        <div className="navbar__dropdown-divider" />
                                        <button className="navbar__dropdown-item navbar__dropdown-logout" onClick={handleLogout}>
                                            <FiLogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm hide-mobile">Login</Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button className="navbar__icon-btn show-mobile" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="navbar__mobile-menu">
                        <form className="navbar__mobile-search" onSubmit={handleSearch}>
                            <FiSearch />
                            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <button type="submit">Go</button>
                        </form>
                        <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/products" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>All Products</Link>
                        <Link to="/products?category=electronics" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Electronics</Link>
                        <Link to="/products?category=fashion" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Fashion</Link>
                        <Link to="/cart" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
                        {userInfo ? (
                            <>
                                <Link to="/profile" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Profile</Link>
                                <Link to="/orders" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
                                {userInfo.role === 'admin' && <Link to="/admin" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Admin</Link>}
                                <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Login / Register</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
