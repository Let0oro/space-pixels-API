import pool from "../../config/db.js";
import genQuerys from "./querys.js";

const pixelQuerys = genQuerys("pixel");

const getAllPixels = async (req, res, next) => {
  try {
    const pixels = await pool.query(pixelQuerys.getAll);
    if (!pixels)
      return res
        .status(404)
        .json({ message: "Not founded data at table pixel" });
    return res.status(200).json(pixels.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getPixel = async (req, res) => {
  const { id } = req.params;
  try {
    const pixel = await pool.query(pixelQuerys.get, [id]);
    if (!pixel) return res.status(404).json({ message: "Pixel not found" });
    return res.status(200).json(pixel.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const newPixel = async (req, res) => {
  const {
    body: { name, email, password },
  } = req;
  try {
    await pool.query(pixelQuerys.post, [name, email, password]);
    return res
      .status(201)
      .json({ message: `Pixel ${name} added to pixel table` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const updatePixel = async (req, res) => {
  const {
    body: { password },
    params: { id },
  } = req;
  try {
    await pool.query(pixelQuerys.update, [password, id]);
    return res.status(201).json({ message: `Pixel ${id} updated` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const deletePixel = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await pool.query(pixelQuerys, [id]);
    return res.status(200).json({ message: `Pixel ${id} has been deleted` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export default {
  getAllPixels,
  getPixel,
  newPixel,
  updatePixel,
  deletePixel,
};
