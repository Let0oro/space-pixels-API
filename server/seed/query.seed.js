const queryTables = {
  player: `CREATE TABLE IF NOT EXISTS player (
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(30) UNIQUE NOT NULL,
  coins INT NOT NULL DEFAULT 20,
  active_ship_id INT NOT NULL DEFAULT 1,
  following_id INT[]
);`,

  store: `CREATE TABLE IF NOT EXISTS store (
  store_id SERIAL PRIMARY KEY
);`,
  
  ship: `CREATE TABLE IF NOT EXISTS ship (
  ship_id SERIAL PRIMARY KEY,
  player_id INT REFERENCES player(id) ON DELETE CASCADE,
  pixels TEXT[] NOT NULL,
  store_id INT REFERENCES store(store_id),
  from_other_id INT
);`,

  likes: `CREATE TABLE IF NOT EXISTS likes (
  store_id INT REFERENCES store(store_id) ON DELETE CASCADE,
  player_id INT REFERENCES player(id) ON DELETE CASCADE,
  PRIMARY KEY (store_id, player_id)
);`,
  
  score: `CREATE TABLE IF NOT EXISTS score (
  playername CHARACTER VARYING(30) REFERENCES player(name) ON DELETE CASCADE,
  points INT NOT NULL,
  PRIMARY KEY (playername)
);`,
};
export { queryTables };
