import pool from "../../config/db.js";
import genQuerys from "./querys.js";

const shipQuerys = genQuerys("ship");

const getAllShips = async (req, res, next) => {
  try {
    // const ships = await pool.query(shipQuerys.getAll);
    const ships = await pool.query("SELECT * FROM ship;");
    if (!ships)
      return res
        .status(404)
        .json({ message: "Not founded data at table ship" });
    return res.status(200).json(ships.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getPublicShips = async (req, res, next) => {
  try {
    const ships = await pool.query("SELECT * FROM store JOIN ship ON ship.store_id = store.store_id;");
    if (!ships)
      return res
        .status(404)
        .json({ message: "Not founded data at table ship" });
    return res.status(200).json(ships.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getPublicShip = async (req, res, next) => {
  const {id} = req.params;
  try {
    const ships = await pool.query("SELECT * FROM store WHERE store_id = $1;", [id]);
    if (!ships)
      return res
        .status(404)
        .json({ message: "Not founded data at table ship" });
    return res.status(200).json(ships.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getPublicShipsOfPlayer = async (req, res, next) => {
  const {id} = req.params;
  try {
    const ships = await pool.query("SELECT *  FROM store JOIN ship WHERE player_id = $1;", [id]);
    if (!ships)
      return res
        .status(404)
        .json({ message: "Not founded data at table ship" });
    return res.status(200).json(ships.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const addPublicShipsToPlayer = async (req, res, next) => {
  const {id} = req.params;
  const {user, ship_id} = req.body;
  try {
    const ship = await pool.query("SELECT pixels, store_id FROM store JOIN ship WHERE player_id = $1 AND ship_id = $2;", [id, ship_id]);
    if (!ship)
      return res
        .status(404)
        .json({ message: "Not founded data at table ship" });

    await pool.query("INSERT INTO ship(player_id, pixels) VALUES($1, $2);", [user.id, ship.pixels]);
    await pool.query("INSERT INTO likes(store_id, player_id) VALUES($1, $2);", [ship.store_id, user.id]);
    await pool.query("UPDATE player SET coins = (coins + 1) WHERE id = $1", [id]);
    return res.status(200).json({message: "Ship added to player library and like registered"});
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const postShip = async (req, res) => {
  const {id: ship_id} = req.params;
  try {
    await pool.query("INSERT INTO store DEFAULT VALUES;");
    await pool.query("UPDATE ship SET store_id = CURRVAL('store_store_id_seq') WHERE ship_id = $1;", [ship_id]);
    return res.status(201).json({message: `ship ${ship_id} published`});
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

const unpostShip = async (req, res) => {
  const {id: store_id} = req.params;
  console.log({store_id})
  try {
    /*
    TAMBIÉN PODRíA CREAR ESTA REGLA tras la creación de tablas: 
    CREATE RULE "_PREV_CASCADE" AS ON DELETE TO ship DO ALSO (
    UPDATE ship SET store_id = NULL
    WHERE (
      SELECT store_id FROM store WHERE store.store_id = ship.store_id 
      ) IS NULL;
  );
    */
    await pool.query("UPDATE ship SET store_id = NULL WHERE store_id = $1", [store_id]);
    await pool.query("DELETE FROM store WHERE store_id = $1;", [store_id]);
    return res.status(201).json({message: `Ship ${store_id} deleted from the store`});
  } catch (error) {
    return res.status(400).json({message: error});
  }
}

const getPublicShipsOrderByLikes = async () => {
  try {
    const ships = pool.query(`SELECT store_id, pixels, COUNT(player_id) AS number_likes 
      FROM likes JOIN ship ON ship.store_id = likes.store_id GROUP BY likes.store_id ORDER BY number_likes;`);
    return res.status(200).json(ships);
  } catch (error) {
    return res.status(400).json({message: "Error at ships in order by likes: " + error});
  }
};

const getLikedShipsFromPlayer = async () => {
  const {user: {id}} = req.body;
  try {
    const ships = pool.query("SELECT  FROM ship JOIN likes ON ship.user_id = likes.user_id WHERE user_id = $1;", [id]);
    return res.status(200).json(ships);
  } catch (error) {
    return res.status(400).json({message: "Error at ships liked by user: " + error});
  }
};

const getShip = async (req, res) => {
  const { id } = req.params;
  try {
    const ship = await pool.query(shipQuerys.get, [id]);
    if (!ship) return res.status(404).json({ message: "Ship not found" });
    return res.status(200).json(ship.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const newShip = async (req, res) => {
  const {
    body: { "0": secuence, player },
  } = req;
  try {
    console.log({player})
    const arrFormated = secuence.map(v => `'${v}'`).join(", ");
    await pool.query(shipQuerys.post, [player.id, arrFormated]);
    return res
      .status(201)
      .json({ message: `Ship added to ship table` });
  } catch (error) {
    console.error({error})
    return res.status(400).json({ message: 'Error creating a new ship' });
  }
};

const updateShip = async (req, res) => {
  const {
    body: { "0": secuence },
    params: { id },
  } = req;
  try {
    await pool.query(shipQuerys.update, [secuence, id]);
    return res.status(201).json({ message: `Ship ${id} updated` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const deleteShip = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    console.log({funct: "deleteShip", id})
    // await pool.query("DELETE FROM ship WHERE ship_id", [id]);
    await pool.query(shipQuerys.delete, [id]);
    return res.status(200).json({ message: `Ship ${id} has been deleted` });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export default {
  getAllShips,
  getShip,
  getPublicShip,
  getPublicShips,
  getPublicShipsOfPlayer,
  addPublicShipsToPlayer,
  getPublicShipsOrderByLikes,
  getLikedShipsFromPlayer,
  newShip,
  postShip,
  updateShip,
  deleteShip,
  unpostShip
};
