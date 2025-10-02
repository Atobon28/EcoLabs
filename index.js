const express = require("express");
const path = require("path");

const usersRouter = require("./server/routes/users.router");
const productsRouter = require("./server/routes/products.router");
const ordersRouter = require("./server/routes/orders.router");
const postsRouter = require("./server/routes/posts.router");

const PORT = 5050;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/", usersRouter);
app.use("/", productsRouter);
app.use("/", ordersRouter);
app.use("/", postsRouter);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);