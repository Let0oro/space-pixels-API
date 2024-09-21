import express from "express";

const scoreRoutes = express.Router();

scoreRoutes.post("/new")
scoreRoutes.get("/all")
scoreRoutes.get("/:id")
scoreRoutes.put("/update/:id")
scoreRoutes.delete("/:id")

export default scoreRoutes;