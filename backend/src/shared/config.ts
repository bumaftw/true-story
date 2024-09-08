import dotenv from 'dotenv';
import { ConfigError } from './errors';

dotenv.config();

const get = (key: string): string => {
  if (!process.env[key]) {
    throw new ConfigError(`Invalid config key: ${key}`);
  }
  return process.env[key];
};

export default {
  get,
};
