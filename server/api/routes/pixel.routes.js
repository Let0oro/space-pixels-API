import express from "express";
import pixelController from "../controllers/pixel.controller.js"
import { getCookieUser } from "../../middleware/user.middleware.js";
const pixelRoutes = express.Router();

pixelRoutes.post("/", getCookieUser, pixelController.newPixel);
pixelRoutes.get("/", pixelController.getAllPixels)
pixelRoutes.get("/:id", pixelController.getPixel)
pixelRoutes.put("/:id", pixelController.updatePixel)
pixelRoutes.delete("/:id", pixelController.deletePixel)

export default pixelRoutes;