import express from "express";
import userController from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.post("/", userController.newUser);
userRoutes.get("/", userController.getAllUsers)
userRoutes.get("/:id", userController.getUser)
userRoutes.put("/:id", userController.updateUser)
userRoutes.delete("/:id", userController.deleteUser)

export default userRoutes;