const genQuerys = (table) =>
  !table
    ? undefined
    : {
      getAll: `SELECT * FROM ${table};`,
      get: `SELECT * FROM ${table} WHERE ${table == "player" ? "id" : "player_id"} = $1;`,
      post:
        (table == "player" &&
          `INSERT INTO player(name, email, password) VALUES ($1, $2, $3);`) ||
        (table == "ship" &&
          `INSERT INTO ship(player_id, pixels) VALUES($1, ARRAY[$2]);`) ||
        (table == "score" &&
          `INSERT INTO score (playername, points) VALUES ($1, $2) 
      ON CONFLICT (playername) DO UPDATE SET points = score.points + excluded.points WHERE excluded.points > score.points;`),
      update:
        (table == "player" && `UPDATE player SET password=$1 WHERE id=$2;`) ||
        (table == "ship" &&
          `UPDATE ship SET pixels=(ARRAY[$1]) WHERE id=$2;`) ||
        (table == "score" && `UPDATE score SET points=$1 WHERE id=$2;`),
      delete: `DELETE FROM ${table} WHERE ${table == "player" ? "id" : table + "_id"}=$1`,
    };

export default genQuerys;
