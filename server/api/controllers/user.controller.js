import client from "../../config/db.js";
import genQuerys from "./querys.js";

const userQuerys = (() => {
  const {
    get,
    getAll,
    postUser: post,
    updateUser: update,
    delete: delet,
  } = genQuerys("users");

  return {
    getAll,
    get,
    post,
    update,
    delete: delet,
  };
})();

const getAllUsers = async (req, res, next) => {
  try {
    const users = await client.query(userQuerys.getAll);
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
    const user = await client.query(userQuerys.get, [id]);
    if (!user) return res.status(404).json({ message: "User not found" });
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
    await client.query(userQuerys.post, [name, email, password]);
    return res
      .status(201)
      .json({ message: `User ${name} added to users table` });
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
    await client.query(userQuerys.update, [password, id]);
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
    await client.query(userQuerys, [id]);
    return res.status(200).json({ message: `User ${id} has been deleted` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export default {
  getAllUsers,
  getUser,
  newUser,
  updateUser,
  deleteUser,
};
