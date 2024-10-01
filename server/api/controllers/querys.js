const genQuerys = (table) => (!table ? undefined : {
  getAll: `SELECT * FROM ${table};`,
  get: `SELECT * FROM ${table} WHERE ${table != "pixel" ? "id" : "userid"} = $1;`,
  post:
    (table == "player" &&
      `INSERT INTO player(name, email, password) VALUES ($1, $2, $3);`) ||
    (table == "pixel" && `INSERT INTO pixel(userid, secuence) VALUES($1, ARRAY[$2]);`) || 
    (table == "score" &&  `INSERT INTO score (username, points) VALUES ($1, $2) 
      ON CONFLICT (username) DO UPDATE SET points = excluded.points WHERE excluded.points > score.points;`),
  update:
    (table == "player" &&
      `UPDATE player SET password=$1 WHERE id=$2;`) ||
    (table == "pixel" && `UPDATE pixel SET secuence=(ARRAY[$1]) WHERE id=$2;`) || 
    (table == "score" &&  `UPDATE score SET points=$1 WHERE id=$2;`),
  delete: `DELETE FROM ${table} WHERE id=$1`,
});


/*

-- insert player
INSERT INTO player (name) VALUES ('user1'),('user2'),('user3');

INSERT INTO score (username, points) VALUES ('user1', 100) ON CONFLICT (username) DO
  UPDATE SET points = excluded.points WHERE excluded.points > score.points;

INSERT INTO score (username, points) VALUES ('user2', 200);

-- insert scores
INSERT INTO score (username, points) VALUES ('user1', 500)
  ON CONFLICT (username) DO
  UPDATE SET points = excluded.points WHERE excluded.points > score.points;

-- fetch 
SELECT * FROM player JOIN score ON username = name;


-- update user.following_id
UPDATE player SET following_id = ARRAY_APPEND(following_id, 2) WHERE id = 1;

-- fetch
SELECT * FROM player JOIN score ON username = name;

--insert ship raw
INSERT INTO ship (user_id, pixels) VALUES (1, ARRAY['#f00', '#0f0', '#00f']);
INSERT INTO ship (user_id, pixels) VALUES (1, ARRAY['#fff', '#000', '#fff']);

-- post a ship in the shop
INSERT INTO shop DEFAULT VALUES;
UPDATE ship SET shop_id = (SELECT COUNT(*) FROM shop) WHERE ship_id = 1;

-- fecth player ship
SELECT * FROM ship WHERE user_id = 1;

-- like a posted ship
SELECT * FROM shop JOIN ship ON ship.shop_id = shop.shop_id WHERE ship.user_id = 1;

UPDATE shop SET likes = ARRAY_APPEND(likes, 2) WHERE shop_id = 1;
INSERT INTO ship (user_id, pixels, from_other_id)
  VALUES (
  2, 
  (SELECT pixels FROM ship JOIN shop ON ship.shop_id = shop.shop_id
    WHERE shop.shop_id = 1), 
  1
); 

SELECT * FROM shop;
SELECT * FROM ship;
SELECT * FROM player JOIN ship ON user_id = id;

*/

export default genQuerys;
