import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiGrid, FiList, FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import { useGetProductsQuery } from '../store/productsApiSlice'
import { useGetCategoriesQuery } from '../store/otherApiSlices'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [view, setView] = useState('grid')
    const [filterOpen, setFilterOpen] = useState(false)

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || '-createdAt',
        page: parseInt(searchParams.get('page')) || 1,
    })

    const queryParams = Object.fromEntries(Object.entries(filters).filter(([k, v]) => v !== '' && v !== undefined))
    const { data, isLoading, isFetching } = useGetProductsQuery({ ...queryParams, limit: 12 })
    const { data: catsData } = useGetCategoriesQuery()

    const products = data?.data || []
    const total = data?.total || 0
    const pages = data?.pages || 1
    const categories = catsData?.data || []

    useEffect(() => {
        const params = {}
        if (filters.search) params.search = filters.search
        if (filters.category) params.category = filters.category
        if (filters.minPrice) params.minPrice = filters.minPrice
        if (filters.maxPrice) params.maxPrice = filters.maxPrice
        if (filters.sort !== '-createdAt') params.sort = filters.sort
        if (filters.page > 1) params.page = filters.page
        setSearchParams(params)
    }, [filters])

    const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }))
    const resetFilters = () => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: '-createdAt', page: 1 })

    const sortOptions = [
        { value: '-createdAt', label: 'Newest First' },
        { value: 'price', label: 'Price: Low to High' },
        { value: '-price', label: 'Price: High to Low' },
        { value: '-ratings', label: 'Top Rated' },
    ]

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <div className="page-header">
                <div className="container">
                    <h1 style={{ marginBottom: '0.5rem' }}>
                        {filters.search ? `Results for "${filters.search}"` : 'All Products'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isLoading ? 'Loading...' : `${total} products found`}
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    {/* Sidebar Filters */}
                    <aside style={{ width: 260, flexShrink: 0 }} className="hide-mobile">
                        <FilterPanel filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} categories={categories} />
                    </aside>

                    {/* Products */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Toolbar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-ghost btn-sm show-mobile" onClick={() => setFilterOpen(!filterOpen)}>
                                    <FiFilter /> Filters
                                </button>
                                <button className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('grid')} title="Grid view"><FiGrid /></button>
                                <button className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('list')} title="List view"><FiList /></button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sort by:</span>
                                <select className="form-input" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: 'auto' }} value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
                                    {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {filterOpen && (
                            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <FilterPanel filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} categories={categories} />
                            </div>
                        )}

                        {/* Loading/Products */}
                        {isLoading || isFetching ? (
                            <div className={view === 'grid' ? 'grid-4' : ''} style={view === 'list' ? { display: 'flex', flexDirection: 'column', gap: '1rem' } : {}}>
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                        <div className="skeleton" style={{ height: 200 }} />
                                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div className="skeleton" style={{ height: 14, width: '70%' }} />
                                            <div className="skeleton" style={{ height: 18 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '5rem 0' }}>
                                <div style={{ fontSize: '4rem' }}>🔍</div>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters</p>
                                <button className="btn btn-primary" onClick={resetFilters}>Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className={view === 'grid' ? 'grid-4' : ''} style={view === 'list' ? { display: 'flex', flexDirection: 'column', gap: '1rem' } : {}}>
                                    {products.map((p) => <ProductCard key={p._id} product={p} />)}
                                </div>

                                {/* Pagination */}
                                {pages > 1 && (
                                    <div className="pagination" style={{ marginTop: '3rem' }}>
                                        <button className="pagination-btn" disabled={filters.page === 1} onClick={() => updateFilter('page', filters.page - 1)}>← Prev</button>
                                        {[...Array(pages)].map((_, i) => (
                                            <button key={i} className={`pagination-btn ${filters.page === i + 1 ? 'active' : ''}`} onClick={() => updateFilter('page', i + 1)}>{i + 1}</button>
                                        ))}
                                        <button className="pagination-btn" disabled={filters.page === pages} onClick={() => updateFilter('page', filters.page + 1)}>Next →</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function FilterPanel({ filters, updateFilter, resetFilters, categories }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem' }}>Filters</h3>
                <button className="btn btn-ghost btn-sm" onClick={resetFilters} style={{ fontSize: '0.8rem' }}>Clear All</button>
            </div>

            {/* Category */}
            <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Category</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: filters.category === '' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        <input type="radio" name="category" value="" checked={filters.category === ''} onChange={() => updateFilter('category', '')} style={{ accentColor: 'var(--accent-primary)' }} />
                        All Categories
                    </label>
                    {categories.map((cat) => (
                        <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: filters.category === cat._id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            <input type="radio" name="category" value={cat._id} checked={filters.category === cat._id} onChange={() => updateFilter('category', cat._id)} style={{ accentColor: 'var(--accent-primary)' }} />
                            {cat.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Price Range</h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="form-input" style={{ width: '50%', padding: '0.5rem', fontSize: '0.875rem' }} />
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                    <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="form-input" style={{ width: '50%', padding: '0.5rem', fontSize: '0.875rem' }} />
                </div>
            </div>

            {/* Rating */}
            <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Min Rating</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {[4, 3, 2, 1].map((r) => (
                        <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input type="radio" name="rating" value={r} onChange={() => updateFilter('minRating', r)} style={{ accentColor: 'var(--accent-primary)' }} />
                            {'★'.repeat(r)}{'☆'.repeat(5 - r)} & up
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}
