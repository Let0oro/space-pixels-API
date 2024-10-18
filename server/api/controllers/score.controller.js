import pool from "../../config/db.js";
import genQuerys from "./querys.js";

const scoreQuerys = genQuerys("score");

const getAllScores = async (req, res, next) => {
  try {
    const { rows: score, rowCount } = await pool.query(
      "SELECT * FROM score JOIN player ON playername = name;"
    );
    if (!rowCount)
      return res.status(404).json({ error: "Not founded data at table score" });
    return res.status(200).json(score);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getScore = async (req, res) => {
  const { id } = req.params;
  try {
    const score = await pool.query(scoreQuerys.get, [id]);
    if (!score) return res.status(404).json({ error: "Score not found" });
    return res.status(200).json(score.rows);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const newScore = async (req, res) => {
  const {
    body: {
      points,
      player: { name, id },
    },
  } = req;
  try {
    await pool.query(scoreQuerys.post, [name, points]);
    if (points >= 20) {
      const pointsToCoins = Math.floor(points / 20);
      await pool.query("UPDATE player SET coins = coins + $1 WHERE id = $2", [
        pointsToCoins,
        id,
      ]);
    }
    return res.status(201).json({ message: `points added to score table` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const deleteScore = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await pool.query(scoreQuerys, [id]);
    return res.status(200).json({ message: `Score ${id} has been deleted` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export default {
  getAllScores,
  getScore,
  newScore,
  updateScore,
  deleteScore,
};
