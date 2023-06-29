import express from "express";
import {
  getCoins,
  getCoinsCount,
  getCoinDetails,
} from "../controllers/coinController";

const router = express.Router();

// Ruta para obtener la cantidad de monedas disponibles en una room
router.get("/coins/:room", getCoinsCount);
router.get("/coins", getCoins);
router.get("/coins/:room/:id", getCoinDetails);

export default router;
