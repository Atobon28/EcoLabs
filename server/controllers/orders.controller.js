const { getAllOrders } = require("../db/orders.db");

// GET /orders → traer todas las órdenes ordenadas por created_at descendente
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrdersController,
};