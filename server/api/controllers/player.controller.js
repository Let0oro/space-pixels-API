import session from "express-session";
import pool from "../../config/db.js";
import genQuerys from "./querys.js";
import bcrypt from "bcrypt";

const playerQuerys = genQuerys("player");

const getExistedPlayerQuery = `SELECT * FROM player WHERE name = $1 OR email = $2`;

const getSessionPlayer = async (req, res) => {
  console.log({ reqSessionFromCall: req.session });
  if (req.session && (req.session.playerId || req.session.playername)) {
    const { playername: name, playerId: id } = req.session;
    const {
      rows: [player],
    } = await pool.query("SELECT * FROM player WHERE id=$1 OR name=$2", [
      id,
      name,
    ]);
    return res.status(200).json(player);
  } else {
    return res.status(404).json({ error: "session expired or nonexistent" });
  }
};

const getAllPlayers = async (req, res, next) => {
  try {
    const player = await pool.query(playerQuerys.getAll);
    if (!player)
      return res
        .status(404)
        .json({ error: "Not founded data at table player" });
    return res.status(200).json(player.rows);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getPlayer = async (req, res) => {
  const { id } = req.params;
  try {
    const player = await pool.query("SELECT * FROM player WHERE name=$1 OR email=$1", [id]);
    if (!player.rowCount)
      return res.status(404).json({ error: "Player not found" });
    return res.status(200).json(player.rows);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const newPlayer = async (req, res) => {
  const {
    body: { name, email, password },
  } = req;
  try {
    const existedPlayer = await pool.query(getExistedPlayerQuery, [
      name,
      email,
    ]);
    if (existedPlayer.rowCount)
      return res.status(400).json({
        error: "Player already exists with this name or email, try with other",
      });
    await pool.query(playerQuerys.post, [name, email, password]);
    return res
      .status(201)
      .json({ message: `Player ${name} added to player table` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const loginPlayer = async (req, res) => {
  try {
    const {
      body: { nameoremail, password },
    } = req;

    console.log({ nameoremail })

    const {
      rowCount: existedPlayer,
      rows: [{ password: playerPassword }],
    } = await pool.query('SELECT * FROM player WHERE name=$1 OR email=$1', [String(nameoremail)]);


    console.log({ existedPlayer, rows })

    if (!existedPlayer || !playerPassword)
      return res.status(404).json({ error: "This player doesn't exists" });

    const isValidPassword = await bcrypt.compare(password, playerPassword);
    if (!isValidPassword)
      return res.status(400).json({ error: "Incorrect password" });


    return res.status(201).json({ message: "loginPlayer" });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Error during login process: " + error });
  }
};

const logoutPlayer = async (req, res) => {
  try {

    return res.status(200).json({ message: "logoutPlayer" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const followPlayer = async (req, res) => {
  const { other, self } = req.params;
  try {
    await pool.query(
      "UPDATE player SET following_id = ARRAY_APPEND( following_id, $1) WHERE id = $2;",
      [other, self]
    );
    return res.status(201).json({ message: `Following ${other}!` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const unfollowPlayer = async (req, res) => {
  const { other, self } = req.params;
  try {
    const {
      rows: [{ following_id: currentFollowing }],
    } = await pool.query("SELECT following_id FROM player WHERE id = $1", [self]);

    const newFollowinfArr = currentFollowing.filter(
      (fow) => fow != other
    );

    if (!newFollowinfArr.length) {
      await pool.query(
        "UPDATE player SET following_id = ARRAY[]::integer[] WHERE id = $1 AND following_id IS NOT NULL AND $2 = ANY(following_id);",
        [self, other]
      );
    } else {
      await pool.query(
        "UPDATE player SET following_id = ARRAY[$1::integer] WHERE id = $2 AND following_id IS NOT NULL AND $3 = ANY(following_id);",
        [newFollowinfArr.join(", "), self, other]
      );
    }
    return res.status(201).json({ message: `Following ${other}!` });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Error at unfollow player: " + error });
  }
};

const updatePlayerPassword = async (req, res) => {
  const {
    body: { password },
    params: { id },
  } = req;
  try {
    await pool.query(playerQuerys.update, [password, id]);
    return res.status(201).json({ message: `Player ${id} password updated` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const updatePlayerSelect = async (req, res) => {
  const { id } = req.params;
  const { n_selected } = req.body;
  try {
    await pool.query("UPDATE player SET active_ship_id = $1 WHERE id = $2", [
      n_selected,
      id,
    ]);
    return res
      .status(201)
      .json({ message: `Player ${id} selected ship updated` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const deletePlayer = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await pool.query(playerQuerys.delete, [id]);
    return res.status(200).json({ message: `Player ${id} has been deleted` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export default {
  getSessionPlayer,
  getAllPlayers,
  getPlayer,
  newPlayer,
  loginPlayer,
  logoutPlayer,
  updatePlayerPassword,
  updatePlayerSelect,
  followPlayer,
  unfollowPlayer,
  deletePlayer,
};
