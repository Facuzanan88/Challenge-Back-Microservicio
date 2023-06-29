import redisClient from "../utils/redisClient";
import { Coin } from "../models/Coin";

// Funcion para obtener todas las monedas en un room
export const getCoinsInRoom = async (room: string): Promise<Coin[]> => {
  const keys = await redisClient.keys(`coin:${room}:*`);
  // console.log(keys);
  const coins: Coin[] = [];

  for (const key of keys) {
    const coinData = await redisClient.hgetall(key);
    const coin: Coin = {
      id: coinData.id,
      x: parseFloat(coinData.x),
      y: parseFloat(coinData.y),
      z: parseFloat(coinData.z),
    };
    coins.push(coin);
  }

  return coins;
};

export const coinDetail = async (room: String, id: String) => {
  const coinKey = `coin:${room}:${id}`;
  const coin = await redisClient.hgetall(coinKey);
  console.log(coin);
  return coin;
};
