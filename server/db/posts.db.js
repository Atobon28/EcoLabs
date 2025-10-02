const supabaseCli = require("../services/supabase.service");

// GET /posts/search?title=tutorial → posts cuyo title contenga "tutorial"
const searchPostsByTitle = async (title) => {
  const { data, error } = await supabaseCli
    .from("posts")
    .select("*")
    .ilike("title", `%${title}%`);

  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

module.exports = {
  searchPostsByTitle,
};