import { config } from 'dotenv';

config();

export const NODE_ENV = process.env.NODE_ENV || 'dev';

// server
export const SERVER_PORT = process.env.SERVER_PORT || '3000';
export const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';
