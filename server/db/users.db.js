const supabaseCli = require("../services/supabase.service");

// GET /users/basic → username y email de todos los usuarios
const getUsersBasic = async () => {
  const { data, error } = await supabaseCli
    .from("users")
    .select("username, email");

  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

// Función existente para traer todos los usuarios
const getAllUsers = async () => {
  const { data, error } = await supabaseCli.from("users").select("*");
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

// Función existente para crear usuario
const createUserInDB = async (user) => {
  const { data, error } = await supabaseCli
    .from("users")
    .insert([user])
    .select();

  if (error) {
    console.error(error);
    return error;
  }

  return data;
};

// Función existente para actualizar usuario
const updateUserInDb = async (newData, userId) => {
  const { data, error } = await supabaseCli
    .from("users")
    .update(newData)
    .eq("id", userId)
    .select();

  if (error) {
    console.error(error);
  }

  return data;
};

// Función existente para eliminar usuario
const deleteUserInDb = async (userId) => {
  const { data, error } = await supabaseCli
    .from("users")
    .delete()
    .eq("id", userId)
    .select();

  if (error) {
    console.error(error);
  }

  return data;
};

module.exports = {
  getAllUsers,
  getUsersBasic,
  createUserInDB,
  updateUserInDb,
  deleteUserInDb,
};