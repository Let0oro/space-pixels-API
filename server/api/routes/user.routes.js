import express from "express";
import userController from "../controllers/user.controller.js";
import {
  getCookieUser,
  hashUserPassword,
  setCookieUser,
} from "../../middleware/user.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";
import pool from "../../config/db.js";

const userRoutes = express.Router();

userRoutes.get("/order", async function (req, res) {
  try {
    const {rows: [{id: lastID}]} = await pool.query("SELECT id FROM users ORDER BY id DESC");
    return res.status(200).json(lastID)
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});
userRoutes.post("/", [setCookieUser, hashUserPassword], userController.newUser);
userRoutes.post(
  "/login",
  [getCookieUser, setCookieUser], // En duda sobre si quitar setCookieUser, probar en navegador
  userController.loginUser
);
userRoutes.post("/logout", userController.logoutUser);
userRoutes.get("/all/", userController.getAllUsers);
userRoutes.get("/one/:id", userController.getUser);
userRoutes.get("/session", userController.getSessionUser);
userRoutes.put("/:id", hashUserPassword, userController.updateUser);
userRoutes.delete("/:id", auth, userController.deleteUser);

export default userRoutes;
