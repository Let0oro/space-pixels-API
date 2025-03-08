import pg from "pg";
import { queryTables } from "../seed/query.seed.js";
import { generateCSV } from "../seed/generateData.js";
import { insertData } from "../seed/insertData.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const checkDBConnection = async () => {
  try {
    const { rows, rowCount, fields } = await pool.query(
      "SELECT TRUE AS connected_to_database;"
    );
    console.log(rows);
    const { rowsP } = await pool.query(
      "\dt;"
    );
    console.log(rowsP);
    const { rowCount: exist } = await pool.query("SELECT * FROM player;")
    if (!exist) createTablesAndSeed();
  } catch (error) {
    console.log("Error connecting to database: ", error);
  }
};


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
checkDBConnection();

export default pool;
