import pool from "../../config/db.js";
import genQuerys from "./querys.js";
import bcrypt from "bcrypt";

const userQuerys = genQuerys("users");

const getExistedUserQuery = `SELECT * FROM users WHERE name = $1 OR email = $2`;

const getSessionUser = async (req, res) => {
  if (req.session && req.session.user && req.session.id) {
    const {user: name, id} = req.session;
    const user = await pool.query("SELECT * FROM users WHERE id=$1 AND name=$2", [id, name]);
    return res
    .status(200)
    .json(user);
  } else {
    return res.status(404).json({message: "session expired"});
  }
  }

const getAllUsers = async (req, res, next) => {
  try {
    const users = await pool.query(userQuerys.getAll);
    if (!users)
      return res
        .status(404)
        .json({ message: "Not founded data at table users" });
    return res.status(200).json(users.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query(userQuerys.get, [id]);
    if (!user.rowCount)
      return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const newUser = async (req, res) => {
  const {
    body: { name, email, password },
  } = req;
  try {
    const existedUser = await pool.query(getExistedUserQuery, [name, email]);
    if (existedUser.rowCount)
      return res.status(400).json({
    message: "User already exists with this name or email, try with other",
  });
  await pool.query(userQuerys.post, [name, email, password]);
    return res
      .status(201)
      .json({ message: `User ${name} added to users table` });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const {
      body: { nameoremail, password },
    } = req;

    const {rowCount: existedUser, rows: [{password: userPassword}]} = await pool.query(getExistedUserQuery, [
      nameoremail,
      nameoremail,
    ]);

    if (!existedUser)
      return res.status(400).json({ message: "This user doesn't exists" });

    const isValidPassword =  await bcrypt.compare(password, userPassword);
    if (!isValidPassword) return res.status(400).json({message: "Incorrect password"});
    // Session auth
    // if (existedUser.rows[0].admin) req.session.admin = true;

    return res.status(200).json({ message: "loginUser" });
  } catch (error) {
    return res.status(400).json({ message: "Error during login process" , error });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Session auth
    // req.session.destroy();
    return res.status(200).json({ message: "logoutUser" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  const {
    body: { password },
    params: { id },
  } = req;
  try {
    await pool.query(userQuerys.update, [password, id]);
    return res.status(201).json({ message: `User ${id} updated` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await pool.query(userQuerys.delete, [id]);
    return res.status(200).json({ message: `User ${id} has been deleted` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export default {
  getSessionUser,
  getAllUsers,
  getUser,
  newUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
};
