import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { logger } from './utils/log.js';
import accountsRountes from './routes/accountsRoutes.js';
import { initDatabase } from './database/config.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors()); //Libera o cors
app.use('/account', accountsRountes);

app.get('/', async (req, res, next) => {
  res.send(`API iniciada`);
});

app.listen(port, async () => {
  await initDatabase();
  logger.info(`API iniciada ( http://localhost:${port} )`);
});
