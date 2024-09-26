const genQuerys = (table) => (!table ? undefined : {
  getAll: `SELECT * FROM ${table};`,
  get: `SELECT * FROM ${table} WHERE id = $1;`,
  post:
    (table == "users" &&
      `INSERT INTO users(name, email, password) VALUES ($1, $2, $3);`) ||
    (table == "pixel" && `INSERT INTO pixel(userid, secuence) VALUES($1, ARRAY[$2]);`) || 
    (table == "score" &&  `INSERT INTO score(score) VALUES ($1);`),
  update:
    (table == "users" &&
      `UPDATE users SET password=$1 WHERE id=$2;`) ||
    (table == "pixel" && `UPDATE pixel SET secuence=(ARRAY[$1]) WHERE userid=$2;`) || 
    (table == "score" &&  `UPDATE score SET score=$1 WHERE id=$2;`),
  delete: `DELETE FROM ${table} WHERE id=$1`,
});

export default genQuerys;
