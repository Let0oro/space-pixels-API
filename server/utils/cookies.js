import bcrypt from "bcrypt";
import pool from "../config/db";

const SECRET_KEY = process.env.SECRET_KEY;

function setCookieUser (req) {
      req.session.userId = user.id;
      req.session.username = user.username;
}

export { setCookieUser  };
