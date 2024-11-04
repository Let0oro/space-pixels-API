const { sign, verify } = require("jsonwebtoken");
const { EXPIRE_TIME_ONE_WEEK } = require("../server");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

async function generateKey(req) {
  try {
    const { id } = req.params;
    const { name, email, nameoremail } = req.body;
    if (!id && !name && !email && !nameoremail)
      return res.status(400).json({ error: "Identificator not provided" });

    const {
      rows: [player],
    } = await pool.query(
      "SELECT id, email, name FROM player WHERE id=$1 OR name=$2 OR name=$3 OR email=$4 OR email=$5",
      [id, name, nameoremail, email, nameoremail]
    );
    const { id: idPlayer, name: namePlayer, email: emailPlayer } = player;

    return sign(
      {
        id: id || idPlayer,
        name: name || nameoremail || namePlayer,
        email: email || nameoremail || emailPlayer,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: EXPIRE_TIME_ONE_WEEK,
      }
    );
  } catch (error) {
    return res.status(400).json({ error });
  }
}

const verifyKey = (token) => {
  try {
    const decoded = verify(token, SECRET_KEY);
    return { playerId: decoded.id };
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { generateKey, verifyKey };
