import pool from "../../config/db.js";
import genQuerys from "./querys.js";

const shipQuerys = genQuerys("ship");

const getAllShips = async (req, res, next) => {
  try {
    const ships = await pool.query("SELECT * FROM ship;");
    if (!ships)
      return res.status(404).json({ error: "Not founded data at table ship" });
    return res.status(200).json(ships.rows);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getPublicShips = async (req, res, next) => {
  try {
    const ships = await pool.query(`
      SELECT ship.ship_id, ship.store_id, player_id, price,  name, following_id, pixels 
      FROM store 
      JOIN ship ON ship.store_id = store.store_id 
      JOIN player ON ship.player_id = player.id;`);
    if (!ships)
      return res.status(404).json({ error: "Not founded data at table ship" });
    return res.status(200).json(ships.rows);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getPublicShip = async (req, res, next) => {
  const { id } = req.params;
  try {
    const ships = await pool.query("SELECT * FROM store WHERE store_id = $1;", [
      id,
    ]);
    if (!ships)
      return res.status(404).json({ error: "Not founded data at table ship" });
    return res.status(200).json(ships.rows);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getPublicShipsOfPlayer = async (req, res, next) => {
  const { other, self } = req.params;

  try {
    const ships = await pool.query(
      "SELECT ship.pixels, player.id, player.name, ship.price, ship.ship_id,  ship.store_id FROM store JOIN ship ON store.store_id = ship.store_id JOIN player ON player.id = ship.player_id WHERE ship.player_id = $1;",
      [other != null ? other : self]
    );
    if (!ships)
      return res.status(404).json({ error: "Not founded data at table ship" });
    return res.status(200).json(ships.rows);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const addOtherShipFromPlayer = async (req, res) => {
  const { id: otherplayerid } = req.params;
  const {
    body: { player, store_id, price },
  } = req;
  try {
    const {
      rows: [{ pixels }],
      rowCount,
    } = await pool.query("SELECT pixels FROM ship WHERE store_id = $1;", [
      store_id,
    ]);
    if (!rowCount)
      return res.status(404).json({ error: "Not founded data at table ship" });

    const pixelsFormated = pixels.map((px) => `'${px}'`).join(",");
    await pool.query(
      "INSERT INTO ship(player_id, pixels, from_other_id) VALUES($1, ARRAY[$2], $3);",
      [player.id, pixelsFormated, otherplayerid]
    );

    await pool.query("UPDATE player SET coins = coins - $1 WHERE id = $2;", [
      price,
      player.id,
    ]);
    await pool.query("UPDATE player SET coins = coins + $1 WHERE id = $2;", [
      price,
      otherplayerid,
    ]);

    return res.status(200).json({ message: "Ship added to player library" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const likeShip = async (req, res) => {
  const { id: otherplayerid } = req.params;
  const {
    body: { player, store_id },
  } = req;

  try {
    await pool.query("INSERT INTO likes(store_id, player_id) VALUES($1, $2);", [
      store_id,
      player.id,
    ]);
    await pool.query("UPDATE player SET coins = (coins + 1) WHERE id = $1;", [
      otherplayerid,
    ]);
    return res.status(201).json({ message: "Liked!" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const unlikeShip = async (req, res) => {
  const { id: like_id } = req.params;
  try {
    await pool.query("DELETE likes WHERE id = $1;", [like_id]);
    return res.status(201).json({ message: "Unliked!" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const postShip = async (req, res) => {
  const { id: ship_id } = req.params;
  const { new_price } = req.body;
  try {
    const {
      rows: [{ last_store_id }],
    } = await pool.query(
      "INSERT INTO store DEFAULT VALUES RETURNING store_id AS last_store_id;"
    );
    await pool.query(
      "UPDATE ship SET (price, store_id) = ($1, $2) WHERE ship_id = $3;",
      [new_price, last_store_id, ship_id]
    );
    return res.status(201).json({
      message: `ship ${ship_id} published at price ${new_price} in store position n_store_id: ${last_store_id}`,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const unpostShip = async (req, res) => {
  const { id: store_id } = req.params;
  try {
    await pool.query("UPDATE ship SET store_id = NULL WHERE store_id = $1", [
      store_id,
    ]);
    await pool.query("DELETE FROM store WHERE store_id = $1;", [store_id]);
    return res
      .status(201)
      .json({ message: `Ship ${store_id} deleted from the store` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const getPublicShipsOrderByLikes = async (req, res) => {
  try {
    const ships =
      pool.query(`SELECT ship.store_id, ship.pixels, COUNT(likes.player_id) AS number_likes, likes.player_id AS likes_from_py
      FROM likes JOIN ship ON ship.store_id = likes.store_id GROUP BY likes.store_id ORDER BY number_likes;`);
    return res.status(200).json(ships);
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Error at ships in order by likes: " + error });
  }
};

const getLikedShipsFromPlayer = async (req, res) => {
  const { id } = req.params
  try {
    const response = await pool.query(
      "SELECT *  FROM ship JOIN likes ON ship.player_id = likes.player_id WHERE ship.player_id = $1;",
      [id]
    );
    return res.status(200).json(response.rows);
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Error at ships liked by player: " + error });
  }
};

const getShip = async (req, res) => {
  const { id } = req.params;
  try {
    console.log({ idGetShipsUser: id })
    const ship = await pool.query(shipQuerys.get, [id]);
    console.log({ shipsUser: ship })
    if (!ship) return res.status(404).json({ error: "Ship not found" });
    return res.status(200).json(ship.rows);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const newShip = async (req, res) => {
  const {
    body: { secuence, player: user },
  } = req;
  try {
    const { rows: [player] } = await pool.query("SELECT * FROM player WHERE name=$1 OR email=$2;", [user.name, user.email])
    const arrFormated = `${secuence.map((v) => `'${v}'`).join(", ")}`;
    await pool.query(shipQuerys.post, [player.id, arrFormated]);
    return res.status(201).json({ message: `Ship added to ship table` });
  } catch (error) {
    return res.status(400).json({ error: "Error creating a new ship" });
  }
};

const updateShip = async (req, res) => {
  const {
    body: { 0: secuence },
    params: { id },
  } = req;
  try {
    await pool.query(shipQuerys.update, [secuence, id]);
    return res.status(201).json({ message: `Ship ${id} updated` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const deleteShip = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const {
      rows: [{ store_id }],
    } = await pool.query("SELECT store_id FROM ship WHERE ship_id = $1", [id]);
    await pool.query(shipQuerys.delete, [id]);
    if (store_id != null)
      await pool.query("DELETE FROM store WHERE store_id = $1", [store_id]);
    const {
      rows: [{ store_id: lastStoreID }],
    } = await pool.query(
      "SELECT store_id FROM store ORDER BY store_id DESC LIMIT 1;"
    );

    return res.status(200).json({ message: `Ship ${id} has been deleted` });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export default {
  getAllShips,
  getShip,
  getPublicShip,
  getPublicShips,
  getPublicShipsOfPlayer,
  likeShip,
  unlikeShip,
  addOtherShipFromPlayer,
  getPublicShipsOrderByLikes,
  getLikedShipsFromPlayer,
  newShip,
  postShip,
  updateShip,
  deleteShip,
  unpostShip,
};
