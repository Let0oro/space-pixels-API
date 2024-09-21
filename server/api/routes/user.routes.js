import express from "express";
import userController from "../controllers/user.controller.js";

const userRoutes = express.Router();

// userRoutes.post("/new", );
userRoutes.get("/", userController.getAllUsers)
userRoutes.get("/:id", userController.getUser)
// userRoutes.put("/update/:id", )
// userRoutes.delete("/:id", )

export default userRoutes;