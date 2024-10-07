const defaultShip =
  "'#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#000000ff', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#000000ff', '#000000ff', '#0000', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#000000ff', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#0000', '#000000ff', '#000000ff', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#000000ff', '#0000'";

const queryTables = {
  player: `CREATE TABLE IF NOT EXISTS player (
  id SERIAL PRIMARY KEY,
  name CHARACTER VARYING(30) UNIQUE NOT NULL,
  email CHARACTER VARYING(60) UNIQUE NOT NULL,
  password TEXT  NOT NULL,
  coins INT NOT NULL DEFAULT 20,
  active_ship_id INT DEFAULT 1,
  following_id INT[]
);`,

  store: `CREATE TABLE IF NOT EXISTS store (
  store_id SERIAL PRIMARY KEY UNIQUE
);`,

  ship: `CREATE TABLE IF NOT EXISTS ship (
  ship_id SERIAL PRIMARY KEY,
  player_id INT REFERENCES player(id) ON DELETE CASCADE,
  pixels TEXT[] NOT NULL DEFAULT ARRAY['#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#000000ff', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#000000ff', '#000000ff', '#0000', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#000000ff', '#000000ff', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#0000', '#000000ff', '#000000ff', '#0000', '#000000ff', '#0000', '#0000', '#0000', '#0000', '#000000ff', '#000000ff', '#000000ff', '#0000'],
  store_id INT REFERENCES store(store_id),
  from_other_id INT,
  price INT NOT NULL DEFAULT 20
);`,

  likes: `CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY UNIQUE,
  store_id INT REFERENCES store(store_id) ON DELETE CASCADE,
  player_id INT REFERENCES player(id) ON DELETE CASCADE
);`,

  score: `CREATE TABLE IF NOT EXISTS score (
  playername CHARACTER VARYING(30) REFERENCES player(name) ON DELETE CASCADE,
  points INT NOT NULL,
  PRIMARY KEY (playername)
);`,
};
export { queryTables };
