class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i'
            }
        } : {}

        // console.log(`this.queryString: ${this.queryString}`);
        // console.log(`this.query: ${this.query}`);
        // console.log(`...keyword: ${{keyword}}`);
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        

        const queryCopy = { ...this.queryString };

        // Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);

        // console.log(`queryCopy: ${queryCopy}`);
        // console.log(`this.queryString: ${this.queryString}`);
        // console.log(`this.query: ${this.query}`);
        // console.log(`...queryCopy: ${{queryCopy}}`);

        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy);
        // console.log(`queryStr: ${queryStr}`);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        // this.query = this.query.find(queryCopy);
        return this;
    }

    pagination() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 4;
        const skip = (page - 1) * limit;

        this.query = this.query.limit(limit).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;