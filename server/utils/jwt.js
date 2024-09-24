const {sign, verify} = require("jsonwebtoken");
const { EXPIRE_TIME } = require("../server");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

async function generateKey (req) {
  try {
    const { id } = req.params;
    const { name, email, nameoremail } = req.body;
    if (!id && !name && !email && !nameoremail)
      return console.log(res.status(400).json({ message: "Identificator not provided" }));

    const { rows: user } = await pool.query(
      "SELECT id, email, name FROM users WHERE id=$1 OR name=$2 OR name=$3 OR email=$4 OR email=$5",
      [id, name, nameoremail, email, nameoremail]
    );
    const {idUser, nameUser, emailUser} = user[0]; 

    return sign(
      {
        id: id || idUser,
        name:  name  || nameoremail || nameUser,
        email: email || nameoremail || emailUser,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: EXPIRE_TIME,
      }
    );
  } catch (error) {
    console.error(error);  }
}

const verifyKey = (token) => {
  try {
    const decoded = verify(token, SECRET_KEY);
    return { userId: decoded.id };
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { generateKey, verifyKey };