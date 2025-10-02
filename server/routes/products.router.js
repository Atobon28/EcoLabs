const express = require("express");
const router = express.Router();

const {
  getAllProductsController,
  getCheapProductsController,
  getElectronicsProductsController,
  getProductsPaginatedController,
  getProductsByUserIdController,
} = require("../controllers/products.controller");

// GET /products → traer todos los productos
router.get("/products", getAllProductsController);

// GET /products/cheap → productos con price < 50
router.get("/products/cheap", getCheapProductsController);

// GET /products/electronics → productos con price > 30 y categoría = "Electronics"
router.get("/products/electronics", getElectronicsProductsController);

// GET /products/page/:page → paginación de 10 en 10
router.get("/products/page/:page", getProductsPaginatedController);

// GET /users/:id/products → productos asociados a un usuario específico
router.get("/users/:id/products", getProductsByUserIdController);

module.exports = router;