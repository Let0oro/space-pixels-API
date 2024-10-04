import pool from "../../config/db.js";
import genQuerys from "./querys.js";

const scoreQuerys = genQuerys("score");

const getAllScores = async (req, res, next) => {
  try {
    const {rows: score} = await pool.query("SELECT * FROM score JOIN player ON playername = name;");
    if (!score)
      return res
        .status(404)
        .json({ message: "Not founded data at table score" });
    return res.status(200).json(score);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getScore = async (req, res) => {
  const { id } = req.params;
  try {
    const score = await pool.query(scoreQuerys.get, [id]);
    if (!score) return res.status(404).json({ message: "Score not found" });
    return res.status(200).json(score.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const newScore = async (req, res) => {
  console.log({username: req.body.user.name, points: req.body.points})
  const {
    body: { points, user: {name} },
  } = req;
  try {
    await pool.query(scoreQuerys.post, [name, points]);
    return res
      .status(201)
      .json({ message: `points added to score table` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const updateScore = async (req, res) => {
  const {
    body: { score },
    params: { id },
  } = req;
  try {
    await pool.query(scoreQuerys.update, [score, id]);
    return res.status(201).json({ message: `Score ${id} updated` });
  } catch (error) {
    return res.status(400).json({ message: error });
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
    return res.status(400).json({ message: error });
  }
};

export default {
  getAllScores,
  getScore,
  newScore,
  updateScore,
  deleteScore,
};
