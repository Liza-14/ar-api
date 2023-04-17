import express from 'express';
import cors from 'cors';
import routers from './routes/routers.js';

const PORT = process.env.PORT || 9000;

const app = express();

app.use(cors());
app.use(routers);

try {
  console.log('\n\x1b[32m[app] starting...');

  app.listen(PORT, () => console.log("\x1b[32m[app] listening has been started\x1b[0m"));
} catch (e) {
  console.log("\x1b[31m[app] " + e + "\x1b[0m");
}