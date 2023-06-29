import { Socket } from "socket.io";
import redisClient from "../utils/redisClient";
import { getCoinsCount } from "../controllers/coinController";
import { getCoinsInRoom } from "./coinService";

// Función para unirse a una sala
export const joinRoom = async (socket: Socket, room: string) => {
  socket.join(room); // socket.join() => genera una comunicacion entre todos los clientes que estan en esta sala
  console.log(`Socket ${socket.id} se unió a la sala ${room}`);
  // Lógica adicional si es necesario
  const result = await getCoinsInRoom(room);
  console.log(result);
};

// Función para manejar la acción de tomar una moneda
export const grabCoin = async (socket: Socket, coinId: string) => {
  // Lógica para eliminar la moneda con coinId de la base de datos Redis
  let rooms = socket.rooms;
  rooms = new Set(["wqpd3LKiIzmdOycQAAAB", "Sala1"]);
  const roomArray = Array.from(rooms);
  const sala1 = roomArray[1];
  await redisClient.del(`coin:${sala1}:${coinId}`);
  console.log(`Moneda ${coinId} tomada por socket ${socket.id}`);

  // Mensaje a todos los clientes en la misma sala de que la moneda ya no está disponible
  const room = socket.rooms.keys().next().value;
  socket.to(room).emit(`La moneda ${coinId} ya no esta disponible`, coinId);
};
