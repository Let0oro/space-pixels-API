import bcrypt from "bcrypt";
import pool from "../config/db.js";

const getPasswordFromReq = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ error: "Password not provided" });
    const {
      rows: [player],
      rowCount: exists,
    } = await pool.query("SELECT * FROM player WHERE id=$1", [id]);
    return { password, playerPassword: exists ? player.password : undefined };
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const hashPlayerPassword = async (req, res, next) => {
  try {
    const { password, playerPassword } = await getPasswordFromReq(req, res);
    const isEqualPassword = playerPassword
      ? await bcrypt.compare(password, playerPassword)
      : false;
    if (isEqualPassword)
      return res.status(400).json({ error: "You cant use the last password" });
    req.body.password = await bcrypt.hash(password, 10);
    return next();
  } catch (error) {
    console.error({ error });
    return res.status(400).json({ error });
  }
};

const getCookiePlayer = async (req, res, next) => {
  console.log("GET COOKIE MIDD")
  console.log({ bodyGet: req.body });
  if (req.body.password || req.body.name || req.body.email || req.body.nameoremail) {
    return next();
  }

  console.log({ sessionGet: req.session });

  if (!req.session.playerId) {
    return res.status(401).json({ error: "No has iniciado sesión" });
  }

  try {
    const { rows: [player], rowCount } = await pool.query("SELECT * FROM player WHERE id=$1", [
      req.session.playerId,
    ]);

    if (!rowCount) {
      return res.status(404).json({ error: "Player not found" });
    }

    req.body.player = player;
    next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};


async function setCookiePlayer(req, res, next) {
  console.log("SET COOKIE MIDD")
  const { name, nameoremail } = req.body || {};
  const { path } = req;

  try {
    const { rows: [playerObjID], rowCount: exists } = nameoremail
      ? await pool.query("SELECT id FROM player WHERE name=$1 OR email=$2", [
        nameoremail,
        nameoremail,
      ])
      : { rowCount: 0, rows: [{ id: null }] };

    if (!exists && path === "/login") {
      return res.status(404).json({ error: "Player not exists" });
    }

    const { rows: [{ id: lastID }] } = await pool.query("SELECT id FROM player ORDER BY id DESC");

    req.session.playerId = exists ? playerObjID.id : lastID + 1;
    req.session.playername = name || req.session.playername;
    next();
  } catch (error) {
    console.error("Error in setCookiePlayer:", error);
    return res.status(400).json({ error: `Error adding info to sessions: ${error}` });
  }
}

export { hashPlayerPassword, getCookiePlayer, setCookiePlayer };
