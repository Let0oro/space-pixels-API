import fs from "fs";
import createCsvWriter from "csv-writer";
import faker from "faker";
import bcrypt from "bcrypt";

const csvDir = "./csvs";

if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir);
}

const NLIST = 10;

const playerCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/player.csv`,
  header: [
    { id: "player_id", title: "player_id" },
    { id: "name", title: "name" },
    { id: "email", title: "email" },
    { id: "password", title: "password" },
    { id: "coins", title: "coins" },
    { id: "active_ship_id", title: "active_ship_id" },
  ],
});

const storeCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/store.csv`,
  header: [{ id: "store_id", title: "store_id" }],
});

const scoreCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/score.csv`,
  header: [
    { id: "playername", title: "playername" },
    { id: "points", title: "points" },
  ],
});

const shipCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/ship.csv`,
  header: [
    { id: "player_id", title: "player_id" },
    { id: "pixels", title: "pixels" },
    { id: "store_id", title: "store_id" },
    { id: "from_other_id", title: "from_other_id" },
  ],
});

const likesCsvWriter = createCsvWriter.createObjectCsvWriter({
  path: `${csvDir}/likes.csv`,
  header: [
    { id: "store_id", title: "store_id" },
    { id: "player_id", title: "player_id" },
  ],
});

export const generateCSV = async () => {
  try {
    const playerData = [];
    const password = bcrypt.hashSync("1234Abcd.", 10);
    for (let i = 1; i <= NLIST; i++) {
      const name = faker.internet.userName();
      playerData.push({
        player_id: i,
        name: name,
        email: `${name}@mail.es`,
        password,
        coins: faker.datatype.number({ min: 0, max: 100 }),
        active_ship_id: faker.datatype.number({ min: 1, max: 3 }),
      });
    }
    await playerCsvWriter.writeRecords(playerData);
    console.log("Archivo player.csv generado exitosamente");

    const storeData = [];
    for (let i = 1; i <= NLIST; i++) {
      storeData.push({ store_id: i });
    }

    await storeCsvWriter.writeRecords(storeData);
    console.log("Archivo likes.csv generado exitosamente");

    const scoreData = playerData.map((player) => ({
      playername: player.name,
      points: faker.datatype.number({ min: 0, max: 1000 }),
    }));
    await scoreCsvWriter.writeRecords(scoreData);

    const shipData = [];
    for (let i = 1; i <= NLIST; i++) {
      shipData.push({
        player_id: i,
        store_id: i == 1 ? NLIST : i - 1,
      });
    }
    await shipCsvWriter.writeRecords(shipData);
    console.log("Archivo ship.csv generado exitosamente");

    const likesData = [];
    for (let i = 1; i <= NLIST; i++) {
      const storeId = faker.datatype.number({ min: 1, max: 5 });
      const playerId = faker.datatype.number({ min: 1, max: 10 });
      likesData.push({ store_id: storeId, player_id: playerId });
    }
    await likesCsvWriter.writeRecords(likesData);
    console.log("Archivo likes.csv generado exitosamente");
  } catch (error) {
    console.error({ err });
  }
};
