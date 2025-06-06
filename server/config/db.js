import pg from "pg";
import { queryTables } from "../seed/query.seed.js";
import { generateCSV } from "../seed/generateData.js";
import { insertData } from "../seed/insertData.js";


const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: !isProduction }
});

const checkDBConnection = async () => {
  try {
    const { rows, rowCount, fields } = await pool.query(
      "SELECT TRUE AS connected_to_database;"
    );
    console.log(rows);
    // const { rowCount: exist } = await pool.query("SELECT * FROM player;")
    // if (!exist) await createTablesAndSeed();
  } catch (error) {
    console.log("Error connecting to database: ", error);
  }
};


const createTablesAndSeed = async () => {
  try {
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
  } catch (error) {
    console.error("Error creating tables or seeding data:", error);
  }
};

checkDBConnection();
createTablesAndSeed();

export default pool;
