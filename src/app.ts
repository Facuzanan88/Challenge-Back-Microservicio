import express from "express";
import http from "http";
import { Server } from "socket.io";
import apiRouter from "./routes/api";
import { Socket, io } from "socket.io-client";
import { grabCoin, joinRoom } from "./services/roomService";
import fs from "fs";
import generateCoins from "./utils/generateCoins";

// cargo el archivo "config.json" donde se alojan las salas y lo transformo en JSON
const configData = fs.readFileSync("config/config.json");
const config = JSON.parse(configData.toString());

const roomsConfig = config.rooms; // roomsConfig es un array

// Genero las monedas en las salas con un ttl de 1 hora
roomsConfig.map((r: any) => {
  generateCoins(r.name, r.coinCount, r.area);
});

const app = express();
const server = http.createServer(app);
const ioServer = new Server(server);

app.use("/", apiRouter);

ioServer.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  const timer = setTimeout(() => {
    joinRoom(socket, "Sala1");
  }, 5000);

  const timer1 = setTimeout(() => {
    grabCoin(socket, "2");

    socket.on("disconnect", () => {
      console.log("Cliente desconectado", socket.id);
    });
  }, 15000);

  socket.on("disconnect", () => {
    clearTimeout(timer);
    console.log("Cliente desconectado antes de que finalice las funciones");
  });
});

// URL del servidor Socket.io
const serverURL = "http://localhost:3000";

// Iniciar el cliente Socket.io
const socket: Socket = io(serverURL);

export { server, ioServer, socket };
