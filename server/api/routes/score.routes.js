import express from "express";
import scoreController from "../controllers/score.controller.js";

const scoreRoutes = express.Router();

scoreRoutes.post("/", scoreController.newScore);
scoreRoutes.get("/", scoreController.getAllScores)
scoreRoutes.get("/:id", scoreController.getScore)
scoreRoutes.put("/:id", scoreController.updateScore)
scoreRoutes.delete("/:id", scoreController.deleteScore)

export default scoreRoutes;