const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets and tech devices', sortOrder: 1 },
    { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', sortOrder: 2 },
    { name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor', sortOrder: 3 },
    { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Sports equipment and activewear', sortOrder: 4 },
    { name: 'Books', slug: 'books', description: 'Books and educational materials', sortOrder: 5 },
    { name: 'Beauty', slug: 'beauty', description: 'Skincare and cosmetics', sortOrder: 6 },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB'.cyan);

        // Clear old data
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();

        // Admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
        });

        // Regular user
        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'user123',
            role: 'user',
        });

        // Categories
        const createdCategories = await Category.insertMany(categories);
        const catMap = {};
        createdCategories.forEach((c) => { catMap[c.slug] = c._id; });

        // Products — slugs are set explicitly so Product.create() doesn't get conflicts
        const productData = [
            { name: 'iPhone 15 Pro', slug: 'iphone-15-pro', description: 'The latest Apple iPhone with A17 chip, titanium design, and pro camera system with 48MP main sensor.', shortDescription: 'Apple iPhone 15 Pro with titanium design', price: 999, comparePrice: 1099, category: catMap['electronics'], brand: 'Apple', stock: 50, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484429be?w=800', public_id: 'demo1' }], tags: ['smartphone', 'apple', 'iphone'], specifications: [{ key: 'Storage', value: '256GB' }, { key: 'RAM', value: '8GB' }, { key: 'Display', value: '6.1 inch Super Retina XDR' }] },
            { name: 'Samsung 4K OLED TV 55 inch', slug: 'samsung-4k-oled-tv-55', description: 'Experience cinematic picture quality with Samsung OLED panel, Quantum HDR, and Dolby Atmos sound.', shortDescription: '55 inch 4K OLED Smart TV', price: 1299, comparePrice: 1599, category: catMap['electronics'], brand: 'Samsung', stock: 20, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=800', public_id: 'demo2' }], tags: ['tv', 'samsung', 'oled'], specifications: [{ key: 'Screen Size', value: '55 inches' }, { key: 'Resolution', value: '4K UHD' }] },
            { name: 'Sony WH-1000XM5 Headphones', slug: 'sony-wh-1000xm5-headphones', description: 'Industry-leading noise cancelling headphones with 30 hour battery life and HD audio quality.', shortDescription: 'Premium noise-cancelling wireless headphones', price: 349, comparePrice: 399, category: catMap['electronics'], brand: 'Sony', stock: 75, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', public_id: 'demo3' }], tags: ['headphones', 'sony', 'audio'] },
            { name: 'MacBook Pro 14 M3', slug: 'macbook-pro-14-m3', description: 'Apple MacBook Pro with M3 chip, 14-inch Liquid Retina XDR display, and all-day battery life.', shortDescription: 'Apple MacBook Pro with M3 chip', price: 1999, comparePrice: 2199, category: catMap['electronics'], brand: 'Apple', stock: 30, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', public_id: 'demo4' }], tags: ['laptop', 'apple', 'macbook'] },
            { name: 'Nike Air Max 270', slug: 'nike-air-max-270', description: 'The Nike Air Max 270 delivers a bold look with a large visible Air unit for all-day comfort on any terrain.', shortDescription: 'Nike running shoes with Air Max cushioning', price: 149, comparePrice: 180, category: catMap['sports-fitness'], brand: 'Nike', stock: 100, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', public_id: 'demo5' }], tags: ['shoes', 'nike', 'running'] },
            { name: 'Minimalist Leather Wallet', slug: 'minimalist-leather-wallet', description: 'Slim genuine leather wallet with RFID blocking, 6 card slots, and a bill compartment.', shortDescription: 'Slim RFID blocking leather wallet', price: 49, comparePrice: 69, category: catMap['fashion'], brand: 'Fossil', stock: 200, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', public_id: 'demo6' }], tags: ['wallet', 'leather', 'accessories'] },
            { name: 'Yoga Mat Pro', slug: 'yoga-mat-pro', description: 'Premium non-slip yoga mat with alignment lines, 6mm thick cushioning and carrying strap.', shortDescription: 'Non-slip premium yoga mat 6mm', price: 59, comparePrice: 79, category: catMap['sports-fitness'], brand: 'Lululemon', stock: 150, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1601925228008-12bdebf4bcfd?w=800', public_id: 'demo7' }], tags: ['yoga', 'fitness', 'mat'] },
            { name: 'Scented Soy Candle Set', slug: 'scented-soy-candle-set', description: 'Set of 3 hand-poured soy wax candles in calming lavender, vanilla, and cedarwood scents.', shortDescription: 'Hand-poured soy candle set of 3', price: 39, comparePrice: 55, category: catMap['home-living'], brand: 'Yankee', stock: 300, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1602874801006-79d27ba30a05?w=800', public_id: 'demo8' }], tags: ['candle', 'home', 'decor'] },
            { name: 'The Psychology of Money', slug: 'the-psychology-of-money', description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel — a must-read personal finance book.', shortDescription: 'Personal finance bestseller by Morgan Housel', price: 18, comparePrice: 25, category: catMap['books'], brand: 'Harriman House', stock: 500, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=800', public_id: 'demo9' }], tags: ['book', 'finance', 'bestseller'] },
            { name: 'Vitamin C Serum', slug: 'vitamin-c-serum', description: 'Brightening 20% Vitamin C serum with hyaluronic acid and ferulic acid for radiant, even skin.', shortDescription: '20% Vitamin C brightening serum', price: 35, comparePrice: 50, category: catMap['beauty'], brand: 'TruSkin', stock: 250, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', public_id: 'demo10' }], tags: ['skincare', 'vitamin c', 'serum'] },
            { name: 'Wireless Gaming Mouse', slug: 'wireless-gaming-mouse', description: 'Ultra-lightweight 61g wireless gaming mouse with 25K DPI sensor, RGB lighting, and 70hr battery.', shortDescription: 'Ultra-lightweight wireless gaming mouse', price: 79, comparePrice: 99, category: catMap['electronics'], brand: 'Logitech', stock: 80, isFeatured: true, images: [{ url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', public_id: 'demo11' }], tags: ['gaming', 'mouse', 'wireless'] },
            { name: 'Ceramic Coffee Mug Set', slug: 'ceramic-coffee-mug-set', description: 'Set of 4 handmade ceramic mugs in earth tones, microwave and dishwasher safe, 12oz capacity each.', shortDescription: 'Handmade ceramic mug set of 4', price: 45, comparePrice: 60, category: catMap['home-living'], brand: 'West Elm', stock: 120, isFeatured: false, images: [{ url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800', public_id: 'demo12' }], tags: ['mug', 'ceramic', 'kitchen'] },
        ];

        // Use create (not insertMany) so pre-save slug hook fires
        for (const p of productData) {
            await Product.create({ ...p, seller: admin._id });
        }

        console.log('Seed data imported successfully!'.green.bold);
        console.log('Admin: admin@example.com / admin123'.yellow);
        console.log('User:  john@example.com / user123'.yellow);
        process.exit(0);
    } catch (error) {
        console.error(error.message.red);
        process.exit(1);
    }
};

seedDB();
