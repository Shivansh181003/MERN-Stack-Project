const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Price cannot exceed 5 characters'],
        default: 0.0
    },
    rating: {
        type: Number,
        default: 0.0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please enter product category']
        // enum: {
        //     values: [
        //         'Electronics',
        //         'Cameras',
        //         'Laptops',
        //         'Accessories',
        //         'Headphones',
        //         'Food',
        //         'Books',
        //         'Clothes/Shoes',
        //         'Beauty/Health',
        //         'Sports',
        //         'Outdoor',
        //         'Home'
        //     ],
        //     message: 'Please select correct category for product'
        // }
    },
    Stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Stock cannot exceed 5 characters'],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            // user: {
            //     type: mongoose.Schema.ObjectId,
            //     ref: 'User',
            //     required: true
            // },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);