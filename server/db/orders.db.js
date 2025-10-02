const supabaseCli = require("../services/supabase.service");

// GET /orders → traer todas las órdenes ordenadas por created_at descendente
const getAllOrders = async () => {
  const { data, error } = await supabaseCli
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

module.exports = {
  getAllOrders,
};