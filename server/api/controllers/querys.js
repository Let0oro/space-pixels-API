const genQuerys = (table) => ({
    getAll: `SELECT * FROM ${table};`,
    get: `SELECT * FROM ${table} WHERE id = $1;`,
    postUser: `INSERT INTO users(name, email, password) VALUES ('$1', '$2', '$3');`,
    postScore: `INSERT INTO score(score) VALUES ('$1');`,
    postPixel: `INSERT INTO pixel(secuence) VALUES ('$1');`,
    updateUser: `UPDATE users SET password='$1' WHERE id='$2';`,
    updateScore: `UPDATE score SET score='$1' WHERE id='$2';`,
    updatePixel: `UPDATE pixel SET secuence='$1' WHERE id='$2';`,
    delete: `DELETE FROM ${table} WHERE id='$1'`
})

export default genQuerys;