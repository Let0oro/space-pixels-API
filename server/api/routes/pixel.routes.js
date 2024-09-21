import express from "express";

const pixelRoutes = express.Router();

pixelRoutes.post("/new")
pixelRoutes.get("/all")
pixelRoutes.get("/:id")
pixelRoutes.put("/update/:id")
pixelRoutes.delete("/:id")

export default pixelRoutes;