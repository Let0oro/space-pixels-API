import { createReadStream } from "fs";
import csv from "csv-parser";
import { default as pool } from "../config/db.js";

export const insertData = async () => {
  try {
    // Leer todos los CSV en memoria
    const playerData = await readCsv('./csvs/player.csv');
    const scoreData = await readCsv('./csvs/score.csv');
    const shipData = await readCsv('./csvs/ship.csv');
    const likesData = await readCsv('./csvs/likes.csv');
    const storeData = await readCsv('./csvs/store.csv');

    // Inserción de datos en el orden correcto
    // 1. Inserción de players
    for (const player of playerData) {
      await pool.query(
        `INSERT INTO player (name, email, password, coins, active_ship_id) 
         VALUES ($1, $2, $3, $4, $5)`,
        [player.name, player.email, player.password, player.coins, player.active_ship_id]
      );
    }
    console.log("Datos de player insertados.");

    // 2. Inserción de scores
    for (const score of scoreData) {
      await pool.query(
        `INSERT INTO score (playername, points) 
         VALUES ($1, $2)
         ON CONFLICT (playername) DO UPDATE
         SET points = EXCLUDED.points WHERE EXCLUDED.points > score.points;`,
        [score.playername, score.points]
      );
    }
    console.log("Datos de score insertados.");

    // 3. Inserción de stores
    for (const store of storeData) {
      await pool.query(`INSERT INTO store (store_id) VALUES ($1)`, [store.store_id]);
    }
    console.log("Datos de store insertados.");

    // 4. Inserción de ships
    for (const ship of shipData) {
      await pool.query(
        `INSERT INTO ship (player_id, store_id) 
         VALUES ($1, $2)`,
        [ship.player_id, ship.store_id]
      );
    }
    console.log("Datos de ship insertados.");

    // 5. Inserción de likes
    for (const like of likesData) {
      await pool.query(
        `INSERT INTO likes (store_id, player_id) 
         VALUES ($1, $2)`,
        [like.store_id, like.player_id]
      );
    }
    console.log("Datos de likes insertados.");
    
  } catch (err) {
    console.error("Error durante la inserción de datos:", err.message);
  }
};

// Función auxiliar para leer CSV
const readCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};
