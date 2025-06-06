import bcrypt from "bcrypt";
import pool from "../config/db.js";

const getPasswordFromReq = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    // if (!password) return res.status(400).json({ error: "Password not provided" });
    if (!password) throw new Error("Password not provided");

    const {
      rows: [player],
      rowCount: exists,
    } = await pool.query("SELECT * FROM player WHERE id=$1", [id]);

    return { password, playerPassword: exists ? player.password : undefined };
  } catch (error) {
    // return res.status(400).json({ error });
    throw error;
  }
};

const hashPlayerPassword = async (req, res, next) => {
  try {
    const { password, playerPassword } = await getPasswordFromReq(req, res);

    const isEqualPassword = playerPassword && await bcrypt.compare(password, playerPassword);

    if (isEqualPassword) return res.status(400).json({ error: "You cant use the last password" });

    req.body.password = await bcrypt.hash(password, 10);
    next();
  } catch (error) {
    console.error("Error in hashPlayerPassword:" + error);
    return res.status(400).json({ error: error.message });
  }
};

const getCookiePlayer = async (req, res, next) => {


  if (req.body.password || req.body.name || req.body.email || req.body.nameoremail) {
    return next();
  }



  if (!req.session.playerId) {
    console.warn("User session not found:", req.session);
    return res.status(401).json({ error: "You are not logged in" });
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

    // req.session.regenerate((err) => {
    //   if (err) {
    //     return res.status(500).json({ error: "Error regenerating session" });
    //   }
    // })

    req.session.playerId = exists ? playerObjID.id : lastID + 1;
    req.session.playername = name || req.session.playername;

    // console.log({ sessionSet: req.session, playerOpts: playerObjID });

    console.log("Datos de sesión guardados:", req.session);
    next();
    // await req.session.save((err) => {
    //   if (err) {
    //     console.error("Error saving session:", err);
    //     return res.status(500).json({ error: "Failed to save session" });
    //   }
    //   console.log("Session successfully saved:", req.session);
    //   next();
    // });;
  } catch (error) {

    return res.status(400).json({ error: `Error adding info to sessions: ${error}` });
  }
}

export { hashPlayerPassword, getCookiePlayer, setCookiePlayer };
