import { createClient } from "redis";

const redis_client = createClient({
  url: process.env.REDIS_URL,
});

export default redis_client;
