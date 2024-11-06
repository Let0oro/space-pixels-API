import pg from "pg";
import { queryTables } from "../seed/query.seed.js";
import { generateCSV } from "../seed/generateData.js";
import { insertData } from "../seed/insertData.js";

const { Pool } = pg;

const pool = new Pool({
  user: "user",
  host: "db",
  database: "db123",
  password: "pass",
  port: 5432,
  // ssl: { rejectUnauthorized: false },
});

const checkDBConnection = async () => {
  const { rows, rowCount, fields } = await pool.query(
    "SELECT TRUE AS connected_to_database"
  );
  console.log(rows);
};
checkDBConnection();

const createTablesAndSeed = async () => {
  await pool.query("DROP TABLE IF EXISTS player CASCADE");
  await pool.query("DROP TABLE IF EXISTS player_session");
  await pool.query("DROP TABLE IF EXISTS store CASCADE ");
  await pool.query("DROP TABLE IF EXISTS score");
  await pool.query("DROP TABLE IF EXISTS likes");
  await pool.query("DROP TABLE IF EXISTS ship");
  await pool.query(queryTables.player);
  await pool.query(queryTables.store);
  await pool.query(queryTables.likes);
  await pool.query(queryTables.ship);
  await pool.query(queryTables.score);

  await generateCSV();
  await insertData();
};

createTablesAndSeed();

export default pool;
