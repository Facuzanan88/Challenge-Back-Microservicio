import { Request, Response } from "express";
import { getCoinsInRoom, coinDetail } from "../services/coinService";

// Controlador para obtener las monedas disponibles en el room y sus coordenadas
export const getCoins = async (req: Request, res: Response) => {
  const room = req.query.room as string;
  const coins = await getCoinsInRoom(room);
  res.json({ coins: coins });
};

// Controlador para obtener la cantidad de monedas disponibles en el room
export const getCoinsCount = async (req: Request, res: Response) => {
  const { room } = req.params;
  const coins = await getCoinsInRoom(room);
  const coinsCount = coins.length;
  res.json({ coins: coinsCount });
};

// Controlador para obtener la cantidad de monedas disponibles en el room
export const getCoinDetails = async (req: Request, res: Response) => {
  const room = req.params.room as String;
  const id = req.params.id as String;
  const coins = await coinDetail(room, id);
  res.json({ coins: coins });
};
