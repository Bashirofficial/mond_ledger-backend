import "dotenv/config";

const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  ACCESS_TOKEN_SECRET: requiredEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: requiredEnv("REFRESH_TOKEN_SECRET"),
  JWT_ACCESS_EXPIRES: requiredEnv("JWT_ACCESS_EXPIRES"),
  JWT_REFRESH_EXPIRES: requiredEnv("JWT_REFRESH_EXPIRES"),
};
