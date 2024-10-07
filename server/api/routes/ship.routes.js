import express from "express";
import shipController from "../controllers/ship.controller.js"
import { getCookiePlayer } from "../../middleware/player.middleware.js";
const shipRoutes = express.Router();

shipRoutes.post("/painted/", getCookiePlayer, shipController.newShip);
shipRoutes.post("/purchase/:id", getCookiePlayer, shipController.addOtherShipFromPlayer);
shipRoutes.post("/like/:id", getCookiePlayer, shipController.likeShip);
shipRoutes.post("/post/:id", shipController.postShip);
shipRoutes.get("/all/", shipController.getAllShips)
shipRoutes.get("/public/", shipController.getPublicShips)
shipRoutes.get("/liked/", shipController.getPublicShipsOrderByLikes);
shipRoutes.get("/liked/player/", getCookiePlayer, shipController.getLikedShipsFromPlayer);
shipRoutes.get("/public/player/:id", getCookiePlayer, shipController.getPublicShipsOfPlayer);
shipRoutes.get("/public/:id", shipController.getPublicShip)
shipRoutes.get("/one/:id", shipController.getShip);
shipRoutes.put("/:id", shipController.updateShip);
shipRoutes.delete("/:id", shipController.deleteShip);
shipRoutes.delete("/like/:id", shipController.deleteShip);
shipRoutes.delete("/post/:id", shipController.unpostShip);

export default shipRoutes;