const queryTables = {
  user: `CREATE TABLE IF NOT EXISTS users 
  (id SERIAL PRIMARY KEY REFERENCES pixel(userid), name VARCHAR (255) UNIQUE NOT NULL REFERENCES score(username), 
  email VARCHAR (255) UNIQUE NOT NULL, password VARCHAR (30) NOT NULL);`,
  pixel: `CREATE TABLE IF NOT EXISTS pixel 
  (userid SERIAL PRIMARY KEY, secuence VARCHAR (255) NOT NULL);`,
  score: `CREATE TABLE IF NOT EXISTS score 
  (username SERIAL PRIMARY KEY, score INT NOT NULL);`,
};

const querySeedUser = `INSERT INTO users(name, email, password) VALUES ('jhon doe', 'test@test.es', 'pass1234')`;

export { queryTables, querySeedUser };
