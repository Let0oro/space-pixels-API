import express from "express";
import playerController from "../controllers/player.controller.js";
import {
  hashPlayerPassword,
} from "../../middleware/player.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";
import pool from "../../config/db.js";

const playerRoutes = express.Router();

playerRoutes.get("/order", async function (req, res) {
  try {
    const { rows: [{ id: lastID }] } = await pool.query("SELECT id FROM player ORDER BY id DESC");
    return res.status(200).json(lastID)
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});
playerRoutes.post("/", hashPlayerPassword, playerController.newPlayer);

playerRoutes.post("/login", playerController.loginPlayer);
playerRoutes.post("/logout", playerController.logoutPlayer);
playerRoutes.get("/all/", playerController.getAllPlayers);
playerRoutes.get("/one/:id", playerController.getPlayer);
playerRoutes.get("/session", playerController.getSessionPlayer);
playerRoutes.put("/password/:id", hashPlayerPassword, playerController.updatePlayerPassword);
playerRoutes.put("/select/:id", playerController.updatePlayerSelect);
playerRoutes.put("/follow/:other/:self", playerController.followPlayer);
playerRoutes.put("/unfollow/:other/:self", playerController.unfollowPlayer);
playerRoutes.delete("/:id", auth, playerController.deletePlayer);

export default playerRoutes;
