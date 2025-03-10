import express from "express";
import shipRoutes from "./api/routes/ship.routes.js";
import scoreRoutes from "./api/routes/score.routes.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { v4 as uid } from "uuid";
import pgSession from "connect-pg-simple";
import pool from "./config/db.js";
import cors from "cors";
import playerRoutes from "./api/routes/player.routes.js";

config();
const PgSession = pgSession(session);

export const EXPIRE_TIME_ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

const server = express();
const port = process.env.PORT || 3000;

server.use(
  cors({
    origin: "https://spacepixels.netlify.app",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
server.options("*", cors()); //  PREVIENE ERRORES DE PREFLIGHT REQUESTS (OPTIONS)

server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));

server.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    genid: () => uid(),
    cookie: {
      httpOnly: true,
      maxAge: EXPIRE_TIME_ONE_WEEK,
      // sameSite: "lax", // dev
      sameSite: "none", // production
      secure: true, // production
      path: "/",
      // domain: ".netlify.app",
      domain: "spacepixels.netlify.app",
    },
    store: new PgSession({
      pool,
      tableName: "player_session",
      createTableIfMissing: true,
    }),
  })
);

const simpleConnection = async (req, res) => {
  try {
    const { rowCount } = await pool.query("SELECT * FROM player;")
    res.status(200).json({ rowCount })
  } catch (error) {
    res.status(400).json({ error })
  }
}

server.use("/api/player", playerRoutes);
server.use("/api/ship", shipRoutes);
server.use("/api/score", scoreRoutes);
server.use("/api/", simpleConnection);
server.use("/", simpleConnection);

server.use("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://spacepixels.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.status(404).json({ error: "Route not found: " + req.path });
});

// server.use("*", (req, res, next) => {
//   const err = new Error("Route not found: " + req.path + ", url: " + req.url);
//   err.status = 404;
//   next(err);
// });

server.listen(port, () => console.log(`Server running on port ${port}`));
