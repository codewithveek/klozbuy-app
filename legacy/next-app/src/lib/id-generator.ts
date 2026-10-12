import { SnowflakeIdGenerator } from "@green-auth/snowflake-unique-id";

const idGenerator = new SnowflakeIdGenerator({
  nodeId: 1, // Unique node ID (0-1023)
  epoch: 1609459200000, // Custom epoch (default: 2021-01-01)
  nodeBits: 10, // Bits for node ID (default: 10)
});
export const generateUniqueId = () => {
  return idGenerator.bigIntId();
};
export const generateUrlSafeId = (length = 8) => {
  return idGenerator.urlSafeId(length);
};
