import winston from 'winston';

const { combine, printf, label, timestamp } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} : ${message}`;
});

export const logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './log/bank-api.log' }),
  ],
  format: combine(label({ label: 'bank-api' }), timestamp(), myFormat),
});
