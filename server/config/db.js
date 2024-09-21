import pg from "pg";
import { queryTables, querySeedUser } from "../seed/query.seed.js";

const { Client } = pg;

const client = new Client({
  user: "user",
  host: "db",
  database: "db123",
  password: "pass",
  port: 5432,
});

client.connect();

const checkDBConnection = async () => {
  const { rows, rowCount, fields } = await client.query(
    "SELECT TRUE AS connected_to_database"
  );
  console.log(rows);
};
checkDBConnection();

const createTablesAndUser = async () => {
  await client.query(queryTables.user);
  await client.query(queryTables.pixel);
  await client.query(queryTables.score);

  const users = await client.query("SELECT * FROM users");
  if (!users.rowCount) await client.query(querySeedUser);
};

createTablesAndUser();

export default client;
