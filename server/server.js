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

const PgSession = pgSession(session);

export const EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;

config();

const port = 3000;

const server = express();
server.use(express.json());
server.use(cookieParser());
server.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);
server.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,

    // unset: "destroy",
    genid: function () {
      return uid();
    },
    cookie: {
      httpOnly: true,
      maxAge: EXPIRE_TIME,
      sameSite: "lax",
    },
    store: new PgSession({
      pool,
      tableName: "player_session",
      createTableIfMissing: true,
    }),
  })
);
server.use(express.urlencoded({ extended: false }));

server.use("/api/player", playerRoutes);
server.use("/api/ship", shipRoutes);
server.use("/api/score", scoreRoutes);

server.use("*", (res, req, next) => {
  const err = new Error("Route not found");
  err.status = 404;
  next(err);
});

server.listen(3000, () => console.log(`Server running on port ${port}`));
