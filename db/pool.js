import config from '../config.js';
import pg from "pg";

const client = new pg.Client({
  user: config.DB_USER,
  host: config.DB_HOST,
  password: config.DB_PASS,
  database: config.DB_NAME,
  port: config.DB_PORT
})

client.connect()
export default client;