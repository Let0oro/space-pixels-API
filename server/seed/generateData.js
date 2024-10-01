
import { createReadStream } from 'fs';
import fs from 'fs';
import csv from 'csv-parser';
import { default as pool } from '../config/db.js';
import createCsvWriter from 'csv-writer';
import faker from 'faker';

const csvDir = './csvs';
if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir);
}

const NLIST = 10;

const playerCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/player.csv`,
  header: [
    { id: 'name', title: 'name' },
    { id: 'coins', title: 'coins' },
    { id: 'active_ship_id', title: 'active_ship_id' },
  ],
});

const storeCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/store.csv`,
  header: [{ id: 'store_id', title: 'store_id' }],
});

const scoreCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/score.csv`,
  header: [
    { id: 'playername', title: 'playername' },
    { id: 'points', title: 'points' },
  ],
});

const shipCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/ship.csv`,
  header: [
    { id: 'player_id', title: 'player_id' },
    { id: 'pixels', title: 'pixels' },
    { id: 'store_id', title: 'store_id' },
    { id: 'from_other_id', title: 'from_other_id' },
  ],
});

const likesCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/likes.csv`,
  header: [
    { id: 'store_id', title: 'store_id' },
    { id: 'player_id', title: 'player_id' },
  ],
});

export const generateCSV = async () => {

  const playerData = [];
  for (let i = 1; i <= NLIST; i++) {
    playerData.push({
      name: faker.internet.userName(),
      coins: faker.datatype.number({ min: 0, max: 100 }),
      active_ship_id: faker.datatype.number({ min: 1, max: 3 }),
    });
  }
  await playerCsvWriter.writeRecords(playerData);
  console.log('Archivo player.csv generado exitosamente');


  const storeData = [];
  for (let i = 1; i <= NLIST; i++) {
    storeData.push({ store_id: i });
  }
  await storeCsvWriter.writeRecords(storeData);
  console.log('Archivo store.csv generado exitosamente');


  const scoreData = playerData.map((player) => ({
    playername: player.name,
    points: faker.datatype.number({ min: 0, max: 1000 }),
  }));
  await scoreCsvWriter.writeRecords(scoreData);
  console.log('Archivo score.csv generado exitosamente');


  const shipData = [];
  for (let i = 1; i <= NLIST; i++) {
    shipData.push({
      player_id: i,
      pixels: JSON.stringify(['#f00', '#0f0', '#00f']),
      store_id: (i == 1 ? 2 :  i-1) ,
    });
  }
  await shipCsvWriter.writeRecords(shipData);
  console.log('Archivo ship.csv generado exitosamente');


  const likesData = [];
  for (let i = 1; i <= NLIST; i++) {
    const storeId = faker.datatype.number({ min: 1, max: 5 });
    const playerId = faker.datatype.number({ min: 1, max: 10 });
    likesData.push({ store_id: storeId, player_id: playerId });
  }
  await likesCsvWriter.writeRecords(likesData);
  console.log('Archivo likes.csv generado exitosamente');
};

export const insertData = async () => {
  try {

    let pshowed = false, sshowed = false, scshowed = false, lshowed = false, shshowed = false;

    const dependencies = async () => {
    
        createReadStream('./csvs/score.csv')
        .pipe(csv())
        .on('data', async (row) => {
            try {
                const { playername, points } = row;
                await pool.query(
                `INSERT INTO score (playername, points) VALUES ($1, $2)
                ON CONFLICT (playername) DO UPDATE
                SET points = EXCLUDED.points WHERE EXCLUDED.points > score.points;`,
                [playername, points]
            );
            // const {rowCount: scoreNumber, rows: scores} = await pool.query("SELECT * FROM score;");
            // if (scoreNumber == 10 && !scshowed) {console.table(scores); scshowed = true};
            
        } catch (err) {
            console.error('Error inserting score:', err.message);
        }
    })
    .on('end', () => {
        console.log('Datos de score insertados.');
    });

    

    createReadStream('./csvs/ship.csv')
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const { player_id, pixels, store_id } = row;
          const randomStored = Math.random() > 0.5;
          const randomVals = [player_id, pixels.replaceAll('"', "'"), null];
          if (randomStored) randomVals.splice(2, 1, store_id);
          await pool.query(
            `INSERT INTO ship (player_id, pixels, store_id) 
            VALUES ($1, ARRAY[$2], $3)`,
            randomVals
          );
            // const {rows, rowCount} = await pool.query("SELECT * FROM ship;");
            // if (rowCount == 10 && !shshowed) {console.table(rows); shshowed = true}

        } catch (err) {
          console.error('Error inserting ship:', err.message);
        }
      })
      .on('end', () => {
        console.log('Datos de ship insertados.');
      });
}


    createReadStream('./csvs/player.csv')
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const { name, coins, active_ship_id } = row;
          await pool.query(
            `INSERT INTO player (name, coins, active_ship_id) VALUES($1, $2, $3)`,
            [name, coins, active_ship_id]
          );
          await pool.query(`INSERT INTO store DEFAULT VALUES`);
          await pool.query("INSERT INTO likes (store_id, player_id) VALUES(LASTVAL(), LASTVAL());");

        //   const {rows: players, rowCount: playerNumber} = await pool.query("SELECT * FROM player;");
        //   const {rows: store, rowCount: storeNumber} = await pool.query("SELECT * FROM store;");
        //   const {rows: likes, rowCount: likesNumber} = await pool.query("SELECT * FROM likes;");
          if (playerNumber == 10 && !pshowed) {/*console.table(players), pshowed = true;*/ await dependencies()};
        //   if (likesNumber == 10 && !pshowed) {console.table(likes), lshowed = true};
        //   if (storeNumber == 10 && !sshowed) {console.table(store); sshowed = true};
        } catch (err) {
          console.error('Error inserting player:', err.message);
        }
      })
      .on('end', () => {
        console.log('Datos de player insertados.');
      });


  } catch (err) {
    console.error('Error durante la inserción de datos:', err.message);
  }
};
