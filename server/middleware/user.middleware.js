import bcrypt from "bcrypt";
import pool from "../config/db.js";

const getPasswordFromReq = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ message: "Password not provided" });
    const {
      rows: [user],
      rowCount: exists,
    } = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    return { password, userPassword: exists ? user.password : undefined };
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const hashUserPassword = async (req, res, next) => {
  try {
    const { password, userPassword } = await getPasswordFromReq(req, res);
    const isEqualPassword = userPassword
      ? await bcrypt.compare(password, userPassword)
      : false;
    if (isEqualPassword)
      return res
        .status(400)
        .json({ message: "You cant use the last password" });
    req.body.password = await bcrypt.hash(password, 10);
    return next();
  } catch (error) {
    console.error({ error });
    return res.status(400).json({ message: error });
  }
};

const getCookieUser = async (req, res, next) => {
  console.log({ body: req.body, sessionUserId: req.session.userId });
  if (
    req.body.password ||
    req.body.name ||
    req.body.email ||
    req.body.nameoremail
  )
    return next();

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
      return res.status(404).json({ message: "User not found" });
    }

    req.body = { ...req.body, user };
    next();
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

async function setCookieUser(req, res, next) {
  const { name, nameoremail } = req?.body || { name: null, nameoremail: null };
  const {path} = req;
  try {
    const {
      rows: [userObjID],
      rowCount: exists,
    } = (nameoremail)
      ? await pool.query(
          "SELECT id FROM users WHERE name=$1 OR email=$2",
          [nameoremail, nameoremail]
        )
      : { rowCount: 0, rows: [{ id: null }] };

      console.log({userObjID, exists})
      console.log({path})

    if (!exists && path == "/login") return res.status(404).json("User not exists")

    const {
      rows: [{ id: lastID }],
    } = await pool.query("SELECT id FROM users ORDER BY id DESC");
    req.session.userId = exists ? userObjID.id : lastID + 1;
    req.session.username = name || req.session.username;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Error adding info to sessions: ${error}` });
  }
}

export { hashUserPassword, getCookieUser, setCookieUser };
