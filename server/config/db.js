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
  await pool.query("DROP TABLE IF EXISTS users")
};
checkDBConnection();


const createTablesAndUser = async () => {
  await pool.query("DROP TABLE IF EXISTS users")
  await pool.query(queryTables.user);
  await pool.query(queryTables.pixel);
  await pool.query(queryTables.score);

  const users = await pool.query("SELECT * FROM users");
  if (!users.rowCount) await pool.query(querySeedUser);
};

createTablesAndUser();

const createSessionTable = async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users_session (
        sid varchar NOT NULL COLLATE "default",
        sess json NOT NULL,
        expire timestamp(6) NOT NULL,
        PRIMARY KEY (sid)
      );
    `;
  
    try {
      await pool.query(createTableQuery);
      console.log('Sessions table created or already exists.');
    } catch (error) {
      console.error('Errorcreating session table: ' + error);
    }
  };
  
  createSessionTable();

export default pool;
