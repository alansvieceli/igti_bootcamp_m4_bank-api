import express from 'express';
import cors from 'cors';

import { logger } from './modules/log.js';
import accountsRountes from './routes/accounts.js';
import { initDatabase } from './modules/repository.js';

const app = express();
const port = 3001;

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
