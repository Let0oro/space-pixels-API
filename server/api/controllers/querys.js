const genQuerys = (table) => (!table ? undefined : {
  getAll: `SELECT * FROM ${table};`,
  get: `SELECT * FROM ${table} WHERE id = $1;`,
  post:
    (table == "users" &&
      `INSERT INTO users(name, email, password) VALUES ($1, $2, $3);`) ||
    (table == "pixel" && `INSERT INTO pixel(userid, secuence) VALUES($1, ARRAY[$2]);`) || 
    (table == "score" &&  `INSERT INTO score (username, points) VALUES ($1, $2) 
      ON CONFLICT (username) DO UPDATE SET points = excluded.points WHERE excluded.points > score.points;`),
  update:
    (table == "users" &&
      `UPDATE users SET password=$1 WHERE id=$2;`) ||
    (table == "pixel" && `UPDATE pixel SET secuence=(ARRAY[$1]) WHERE userid=$2;`) || 
    (table == "score" &&  `UPDATE score SET points=$1 WHERE id=$2;`),
  delete: `DELETE FROM ${table} WHERE id=$1`,
});

export default genQuerys;
