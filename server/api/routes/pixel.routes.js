import express from "express";
import pixelController from "../controllers/pixel.controller.js"
const pixelRoutes = express.Router();

pixelRoutes.post("/", pixelController.newPixel);
pixelRoutes.get("/", pixelController.getAllPixels)
pixelRoutes.get("/:id", pixelController.getPixel)
pixelRoutes.put("/:id", pixelController.updatePixel)
pixelRoutes.delete("/:id", pixelController.deletePixel)

export default pixelRoutes;