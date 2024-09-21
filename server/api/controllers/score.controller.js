import client from "../../config/db.js";
import genQuerys from "./querys.js";

const scoreQuerys = (() => {
  const {
    get,
    getAll,
    postScore: post,
    updateScore: update,
    delete: delet,
  } = genQuerys("score");

  return {
    getAll,
    get,
    post,
    update,
    delete: delet,
  };
})();

const getAllScores = async (req, res, next) => {
  try {
    const scores = await client.query(scoreQuerys.getAll);
    if (!scores)
      return res
        .status(404)
        .json({ message: "Not founded data at table score" });
    return res.status(200).json(scores.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getScore = async (req, res) => {
  const { id } = req.params;
  try {
    const score = await client.query(scoreQuerys.get, [id]);
    if (!score) return res.status(404).json({ message: "Score not found" });
    return res.status(200).json(score.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const newScore = async (req, res) => {
  const {
    body: { score },
  } = req;
  try {
    await client.query(scoreQuerys.post, [score]);
    return res
      .status(201)
      .json({ message: `Score added to score table` });
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
    await client.query(scoreQuerys.update, [score, id]);
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
    await client.query(scoreQuerys, [id]);
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
