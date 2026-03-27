import redis_client from "../lib/redis";

export async function deleteCache(pattern: string) {
  let cursor = "0";
  do {
    const result = await redis_client.scan(cursor, {
      MATCH: pattern,
      COUNT: 50,
    });
    cursor = result.cursor;
    const keys = result.keys;
    if (keys.length > 0) {
      await redis_client.unlink(keys);
    }
  } while (cursor !== "0");
}
