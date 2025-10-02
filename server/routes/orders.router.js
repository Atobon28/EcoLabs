const express = require("express");
const router = express.Router();

const { getAllOrdersController } = require("../controllers/orders.controller");

// GET /orders → traer todas las órdenes ordenadas por created_at descendente
router.get("/orders", getAllOrdersController);

module.exports = router;