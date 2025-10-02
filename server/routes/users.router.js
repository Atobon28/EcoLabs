const express = require("express");
const router = express.Router();

const {
  getAllUsersController,
  getUsersBasicController,
  createUserController,
  updateUserController,
  deleteUserController,
} = require("../controllers/users.controller");

// GET /users/basic → username y email de todos los usuarios
router.get("/users/basic", getUsersBasicController);

// Rutas existentes para CRUD de usuarios
router.get("/users", getAllUsersController);
router.post("/users", createUserController);
router.put("/users/:id", updateUserController);
router.delete("/users/:id", deleteUserController);

module.exports = router;