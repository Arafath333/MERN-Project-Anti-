import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiShoppingCart, FiHeart, FiEye, FiStar } from 'react-icons/fi'
import { addToCart } from '../store/cartSlice'
import toast from 'react-hot-toast'

const StarRating = ({ rating, numReviews }) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <FiStar key={i} size={12} style={{
                fill: i <= Math.floor(rating) ? 'var(--warning)' : 'transparent',
                color: i <= rating ? 'var(--warning)' : 'var(--text-muted)',
            }} />
        )
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 2 }}>{stars}</div>
            {numReviews !== undefined && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({numReviews})</span>
            )}
        </div>
    )
}

export default function ProductCard({ product }) {
    const dispatch = useDispatch()
    const discount = product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.url || '',
            stock: product.stock,
            quantity: 1,
        }))
        toast.success(`${product.name} added to cart!`)
    }

    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-card__image">
                    <img
                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
                        alt={product.name}
                        loading="lazy"
                    />
                    {discount > 0 && (
                        <div className="product-card__badge">
                            <span className="badge badge-success">-{discount}%</span>
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="badge badge-error">Out of Stock</span>
                        </div>
                    )}
                    <div className="product-card__actions">
                        <button className="product-card__action-btn" title="Quick view">
                            <FiEye size={14} />
                        </button>
                        <button className="product-card__action-btn" title="Wishlist">
                            <FiHeart size={14} />
                        </button>
                    </div>
                </div>

                <div className="product-card__content">
                    <p className="product-card__brand">{product.brand || product.category?.name}</p>
                    <h3 className="product-card__name">{product.name}</h3>
                    <StarRating rating={product.ratings} numReviews={product.numReviews} />
                    <div className="product-card__price" style={{ marginTop: 8 }}>
                        <span className="product-card__price-current">${product.price.toFixed(2)}</span>
                        {product.comparePrice > product.price && (
                            <span className="product-card__price-old">${product.comparePrice.toFixed(2)}</span>
                        )}
                        {discount > 0 && <span className="product-card__price-discount">Save {discount}%</span>}
                    </div>
                </div>
            </Link>

            <div className="product-card__footer">
                <button
                    className="btn btn-primary btn-sm product-card__add-btn"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                >
                    <FiShoppingCart size={15} />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    )
}

export { StarRating }
