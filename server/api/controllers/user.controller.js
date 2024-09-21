import client from "../../config/db.js";

const userQuerys = {
  getAll: "SELECT * FROM users",
  get: "SELECT * FROM users WHERE id = $1",
};

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

export default {
  getAllUsers,
  getUser
};
