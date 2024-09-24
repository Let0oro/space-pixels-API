import bcrypt from "bcrypt";

const getPasswordFromReq = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) res.status(400).json({ message: "Password not provided" });
    const { rows: user } = await pool.query(
      "SELECT * FROM users WHERE id=$1",
      [id]
    );
    const userPassword = user[0].password;
    return { password, userPassword };
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

async function hashUserPassword(req, res, next) {
  try {
    const { password, userPassword } = await getPasswordFromReq();
    const isEqualPassword = await bcrypt.compare(password, userPassword);
    if (!isEqualPassword) req.body.password = await bcrypt.hash(password, 10);
    if (isEqualPassword)
      return res
        .status(400)
        .json({ message: "You cant use the last password" });
    next();
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

const comparePassword = async (password) => {
  const {userPassword} = await getPasswordFromReq();
  return await bcrypt.compare(password, userPassword);
};

const  getCookieUser = async (req, res) => {

  if (req.body.email) return next();

  if (!req.session.userId) {
    return res.status(401).json({ message: "No has iniciado sesión" });
  }

  try {
    const {rows: [user], rowCount} = await pool.query("SELECT * FROM users WHERE id=$1", [req.session.userId])

    if (!rowCount) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

   req.body = user;
   next();
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error });
  }

}

export {
  hashUserPassword, 
  comparePassword,
  getCookieUser
}