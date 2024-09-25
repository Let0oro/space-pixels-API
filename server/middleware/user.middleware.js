import bcrypt from "bcrypt";
import pool from "../config/db.js";

const getPasswordFromReq = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password not provided" });
    const { rows: [user], rowCount: exists } = await pool.query("SELECT * FROM users WHERE id=$1", [
      id,
    ]);
    return { password, userPassword: exists ? user.password : undefined };
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const hashUserPassword = async (req, res, next) => {
  try {
    const { password, userPassword } = await getPasswordFromReq(req, res);
    const isEqualPassword = userPassword ? await bcrypt.compare(password, userPassword) : false;
    if (isEqualPassword)
      return res
        .status(400)
        .json({ message: "You cant use the last password" });
    req.body.password = await bcrypt.hash(password, 10);
    return next();
  } catch (error) {
    console.error({error})
    return res.status(400).json({ message: error });
  }
};

const comparePassword = async (password) => {
  const { userPassword } = await getPasswordFromReq();
  return await bcrypt.compare(password, userPassword);
};

const getCookieUser = async (req, res) => {
  if (req.body.email) return next();

  if (!req.session.userId) {
    return res.status(401).json({ message: "No has iniciado sesión" });
  }

  try {
    const {
      rows: [user],
      rowCount,
    } = await pool.query("SELECT * FROM users WHERE id=$1", [
      req.session.userId,
    ]);

    if (!rowCount) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.body = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error });
  }
};

async function setCookieUser(req, res, next) {
  const { name } = req.body;
  try {
    const {
      rows: [userObjID],
      rowCount: exists,
    } = await pool.query("SELECT id FROM users WHERE name=$1", [name]);
    const {
      rows: [{id: lastID}],
    } = await pool.query("SELECT id FROM users ORDER BY id DESC");
    console.log({ userObjID, lastID });
    req.session.userId = exists ? userObjID.id : lastID + 1;
    req.session.username = name;
    next();
  } catch (error) {
    return res.status(400).json({message: `Error adding info to sessions: ${error}` })
  }
}

export { hashUserPassword, comparePassword, getCookieUser, setCookieUser };
