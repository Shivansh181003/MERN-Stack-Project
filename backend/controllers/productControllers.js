const catchAsyncError = require('../middelware/catchAsyncError');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');


// Create new product => /api/v1/product/new -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    // console.log(req);
    req.body.createdBy = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

// Get all products => /api/v1/products
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination();


    // console.log(apiFeatures);
    // console.log(req.query);
    const products = await apiFeatures.query;
    // console.log(products);

    res.status(200).json({
        success: true,
        products
    });

    // res.status(200)
    // Product.find()
    //     .then((products) => {
    //         res.status(200).json(products);
    //     })
    //     .catch((error) => {
    //         res.status(400).json({
    //             error: error,
    //         });
    //     });
})

// Get single product details => /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    
        }
    
    res.status(200).json({
        success: true,
        product
    })
})

// Update product => /api/v1/product/:id -- Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    })
})

// Delete product => /api/v1/product/:id -- Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product not found', 404));
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Product is deleted'
    })
})