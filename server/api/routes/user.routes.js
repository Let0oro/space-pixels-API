import express from "express";
import userController from "../controllers/user.controller.js";
import { setCookieUser } from "../../utils/cookies.js";
import { getCookieUser, hashUserPassword } from "../../middleware/user.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/", [setCookieUser, hashUserPassword], userController.newUser);
userRoutes.post("/login", [getCookieUser, setCookieUser], userController.loginUser);
userRoutes.post("/logout", userController.logoutUser);
userRoutes.get("/", userController.getAllUsers)
userRoutes.get("/:id", userController.getUser)
userRoutes.put("/:id", hashUserPassword, userController.updateUser)
userRoutes.delete("/:id", auth, userController.deleteUser)

export default userRoutes;