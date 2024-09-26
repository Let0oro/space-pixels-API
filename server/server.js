import express from "express";
import userRoutes from "./api/routes/user.routes.js";
import pixelRoutes from "./api/routes/pixel.routes.js";
import scoreRoutes from "./api/routes/score.routes.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { v4 as uid } from "uuid";
import pgSession from "connect-pg-simple";
import pool from "./config/db.js";
import cors from "cors";

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
      sameSite: "strict",
    },
    store: new PgSession({
      pool,
      tableName: "users_session",
    }),
  })
);
server.use(express.urlencoded({ extended: false }));

server.use("/api/user", userRoutes);
server.use("/api/pixel", pixelRoutes);
server.use("/api/score", scoreRoutes);

server.use("*", (res, req, next) => {
  const err = new Error("Route not found");
  err.status = 404;
  next(err);
});

server.listen(3000, () => console.log(`Server running on port ${port}`));
