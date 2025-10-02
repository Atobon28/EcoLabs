const supabaseCli = require("../services/supabase.service");

// GET /products → traer todos los productos
const getAllProducts = async () => {
  const { data, error } = await supabaseCli.from("products").select("*");
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

// GET /products/cheap → productos con price < 50
const getCheapProducts = async () => {
  const { data, error } = await supabaseCli
    .from("products")
    .select("*")
    .lt("price", 50);

  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

// GET /products/electronics → productos con price > 30 y categoría = "Electronics"
const getElectronicsProducts = async () => {
  const { data, error } = await supabaseCli
    .from("products")
    .select("*")
    .gt("price", 30)
    .eq("category", "Electronics");

  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

// GET /products/page/:page → paginación de 10 en 10
const getProductsPaginated = async (page) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, error } = await supabaseCli
    .from("products")
    .select("*")
    .range(from, to);

  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

// GET /users/:id/products → productos asociados a un usuario específico
const getProductsByUserId = async (userId) => {
  const { data, error } = await supabaseCli
    .from("products")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

module.exports = {
  getAllProducts,
  getCheapProducts,
  getElectronicsProducts,
  getProductsPaginated,
  getProductsByUserId,
};