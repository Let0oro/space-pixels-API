import pg from "pg";
import { queryTables, querySeedUser } from "../seed/query.seed.js";

const { Pool } = pg;

const pool = new Pool({
  user: "user",
  host: "db",
  database: "db123",
  password: "pass",
  port: 5432,
});

const checkDBConnection = async () => {
  const { rows, rowCount, fields } = await pool.query(
    "SELECT TRUE AS connected_to_database"
  );
  console.log(rows);
};
checkDBConnection();

const createTablesAndUser = async () => {
  await pool.query(queryTables.user);
  await pool.query(queryTables.pixel);
  await pool.query(queryTables.score);

  const users = await pool.query("SELECT * FROM users");
  if (!users.rowCount) await pool.query(querySeedUser);
};

createTablesAndUser();

export default pool;
