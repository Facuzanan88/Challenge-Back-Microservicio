import redisClient from "../utils/redisClient";
import { Coin } from "../models/Coin";
import cron from "node-cron";

interface Area {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  zmin: number;
  zmax: number;
}

const generateCoins = async (room: string, count: number, area: Area) => {
  let coins: Coin[] = [];
  let coinCounter = 0; // contador global para el id de las monedas que se van regenerando
  const tiempoDeExpiracion = 3600; // segundos

  const generateNewCoins = async () => {
    // Previo borrado de monedas
    let coinsCounter = coins.length;
    console.log(coinsCounter);

    for (let i = 0; i < coins.length; i++) {
      await redisClient.del(`coin:${room}:${coins[i].id}`);
    }
    coins = [];

    // Generacion de las nuevas monedas
    if (coinsCounter === 0) {
      for (let i = 0; i < count; i++) {
        const coin: Coin = {
          id: `${coinCounter}`,
          x: getRandomCoordinate(area.xmin, area.xmax),
          y: getRandomCoordinate(area.ymin, area.ymax),
          z: getRandomCoordinate(area.zmin, area.zmax),
        };

        coins.push(coin);
        await redisClient.hmset(`coin:${room}:${coin.id}`, coin);
        await redisClient.expire(`coin:${room}:${coin.id}`, tiempoDeExpiracion);

        coinCounter++;
      }
    } else {
      for (let i = 0; i < coinsCounter; i++) {
        const coin: Coin = {
          id: `${coinCounter}`,
          x: getRandomCoordinate(area.xmin, area.xmax),
          y: getRandomCoordinate(area.ymin, area.ymax),
          z: getRandomCoordinate(area.zmin, area.zmax),
        };

        coins.push(coin);
        await redisClient.hmset(`coin:${room}:${coin.id}`, coin);
        await redisClient.expire(`coin:${room}:${coin.id}`, tiempoDeExpiracion);

        coinCounter++;
      }
    }

    console.log(`Monedas generas en la sala ${room} correctamente`);
  };

  cron.schedule("0 * * * *", generateNewCoins);

  // Se generan las nuevas monedas luego de un determinado tiempo
  await generateNewCoins();
};

const getRandomCoordinate = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export default generateCoins;
