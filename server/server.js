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
const port = 3000;

server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));

server.use(
  cors({
    // origin: "https://spacepixels.netlify.app",
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
server.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    genid: () => uid(),
    cookie: {
      httpOnly: true,
      maxAge: EXPIRE_TIME_ONE_WEEK,
      sameSite: "lax", // dev
      // sameSite: "none", // production
      secure: true, // production
      path: "/",
      // domain: ".netlify.app"
    },
    store: new PgSession({
      pool,
      tableName: "player_session",
      createTableIfMissing: true,
    }),
  })
);

server.use("/api/player", playerRoutes);
server.use("/api/ship", shipRoutes);
server.use("/api/score", scoreRoutes);

server.use("*", (req, res, next) => {
  const err = new Error("Route not found");
  err.status = 404;
  next(err);
});

server.listen(port, () => console.log(`Server running on port ${port}`));
