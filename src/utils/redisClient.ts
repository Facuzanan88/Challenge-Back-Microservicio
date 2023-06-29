import Redis, { RedisOptions } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redisOptions: RedisOptions = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT || "6379"),
  // password: REDIS_PASSWORD,
};

const redisClient = new Redis(redisOptions);

export default redisClient;
