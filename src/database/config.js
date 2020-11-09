import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from '../utils/log.js';

dotenv.config();

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@bootcampigti.wamxt.mongodb.net/my-bank?retryWrites=true&w=majority`;

export const initDatabase = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Conectado ao MongoDB');
  } catch (err) {
    logger.error('Erro ao conectar no MongoDB');
    logger.error(err);
  }
};
