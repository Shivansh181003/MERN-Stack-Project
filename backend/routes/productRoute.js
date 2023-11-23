const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct } = require('../controllers/productControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../middelware/auth');

const router = express.Router();

router.route("/products").get(isAuthenticatedUser ,authorizeRoles("admin"),getAllProducts) // get all products
router.route("/product/new").post( isAuthenticatedUser, createProduct) // Create a new product
router.route("/product/:id").get(getSingleProduct) // get single product
router.route("/product/:id").put( isAuthenticatedUser, updateProduct) // Update a new product
router.route("/product/:id").delete( isAuthenticatedUser, deleteProduct) // Delete a new product

module.exports = router; // export the router

