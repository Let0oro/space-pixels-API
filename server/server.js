import express from "express";
import client from "./config/db.js";
import userRoutes from "./api/routes/user.routes.js";

const port = 3000;

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/api/all", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM users`);

    if (response) {
      res.status(200).send(response.rows);
    }
  } catch (error) {
    res.status(500).send("Error");
    console.log(error);
  }
});

server.use("/api/user", userRoutes);
// server.use("/api/pixel", pixelRoutes);
// server.use("/api/score", scoreRoutes);

server.use('*', (res, req, next) => {
  const err = new Error('Route not found');
  err.status = 404;
  next(err);
});

server.listen(3000, () => console.log(`Server running on port ${port}`));
