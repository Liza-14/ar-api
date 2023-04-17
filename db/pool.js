import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const client = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  })

client.connect()
export default client;