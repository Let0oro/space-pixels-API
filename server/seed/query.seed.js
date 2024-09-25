const queryTables = {
  user: `CREATE TABLE IF NOT EXISTS users 
  (id SERIAL PRIMARY KEY, 
  name CHARACTER VARYING(60) UNIQUE NOT NULL, 
  email CHARACTER VARYING(60) UNIQUE NOT NULL, 
  password TEXT NOT NULL);`,
  pixel: `CREATE TABLE IF NOT EXISTS pixel 
  (userid INT REFERENCES users(id), 
  secuence TEXT NOT NULL);`,
  score: `CREATE TABLE IF NOT EXISTS score 
  (username  CHARACTER VARYING(60) REFERENCES users(name), 
  score INT NOT NULL);`,
};

const querySeedUser = `INSERT INTO users(name, email, password) VALUES ('jhon doe', 'test@test.es', 'pass1234')`;

export { queryTables, querySeedUser };
