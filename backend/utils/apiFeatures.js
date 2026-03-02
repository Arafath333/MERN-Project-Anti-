// Advanced API filtering, search, sort, pagination utility
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Price range
        if (queryObj.minPrice || queryObj.maxPrice) {
            queryObj.price = {};
            if (queryObj.minPrice) queryObj.price.$gte = Number(queryObj.minPrice);
            if (queryObj.maxPrice) queryObj.price.$lte = Number(queryObj.maxPrice);
            delete queryObj.minPrice;
            delete queryObj.maxPrice;
        }

        // Category filter
        if (queryObj.category) {
            queryObj.category = queryObj.category;
        }

        // Rating filter
        if (queryObj.minRating) {
            queryObj.ratings = { $gte: Number(queryObj.minRating) };
            delete queryObj.minRating;
        }

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    search() {
        if (this.queryString.search) {
            this.query = this.query.find({
                $text: { $search: this.queryString.search },
            });
        }
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        return this;
    }

    paginate() {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 12;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
