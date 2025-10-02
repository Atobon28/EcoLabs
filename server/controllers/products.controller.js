const {
  getAllProducts,
  getCheapProducts,
  getElectronicsProducts,
  getProductsPaginated,
  getProductsByUserId,
} = require("../db/products.db");

// GET /products → traer todos los productos
const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /products/cheap → productos con price < 50
const getCheapProductsController = async (req, res) => {
  try {
    const products = await getCheapProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /products/electronics → productos con price > 30 y categoría = "Electronics"
const getElectronicsProductsController = async (req, res) => {
  try {
    const products = await getElectronicsProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /products/page/:page → paginación de 10 en 10
const getProductsPaginatedController = async (req, res) => {
  try {
    const { page } = req.params;
    const pageNumber = parseInt(page);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ error: "Número de página inválido" });
    }

    const products = await getProductsPaginated(pageNumber);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/:id/products → productos asociados a un usuario específico
const getProductsByUserIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const products = await getProductsByUserId(userId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProductsController,
  getCheapProductsController,
  getElectronicsProductsController,
  getProductsPaginatedController,
  getProductsByUserIdController,
};