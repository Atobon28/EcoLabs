const {
  getAllUsers,
  getUsersBasic,
  createUserInDB,
  updateUserInDb,
  deleteUserInDb,
} = require("../db/users.db");

// GET /users/basic → username y email de todos los usuarios
const getUsersBasicController = async (req, res) => {
  try {
    const users = await getUsersBasic();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función existente para traer todos los usuarios
const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función existente para crear usuario
const createUserController = async (req, res) => {
  try {
    const { name, username, email } = req.body;

    if (!name || !username || !email) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const newUser = { name, username, email };
    const user = await createUserInDB(newUser);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función existente para actualizar usuario
const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const updateData = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const user = await updateUserInDb(updateData, userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función existente para eliminar usuario
const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const user = await deleteUserInDb(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsersController,
  getUsersBasicController,
  createUserController,
  updateUserController,
  deleteUserController,
};