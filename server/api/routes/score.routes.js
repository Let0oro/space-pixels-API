import express from "express";
import scoreController from "../controllers/score.controller.js";
import { getCookiePlayer } from "../../middleware/player.middleware.js";

const scoreRoutes = express.Router();

scoreRoutes.post("/", scoreController.newScore);
scoreRoutes.get("/", scoreController.getAllScores);
scoreRoutes.get("/:id", scoreController.getScore);
scoreRoutes.delete("/:id", scoreController.deleteScore);

export default scoreRoutes;
