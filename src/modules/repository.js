import mongoose from 'mongoose';
import connectionString from '../database/config.js';
import { accountModel } from '../models/accountModel.js';
import { logger } from '../modules/log.js';

const TARIFA_SAQUE = 1;
const TARIFA_TRANSFERENCIA = 8;

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

export const insertAccount = async value => {
  try {
    const account = new accountModel(value);

    let error = await account.validateSync();
    if (error) throw new Error(error.errors.name);

    await account.save();

    return account;
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
};

const doSelectAccount = async (agencia, conta) => {
  try {
    const account = await accountModel
      .findOne({
        agencia: agencia,
        conta: conta,
      })
      .exec();

    if (!account) throw new Error('Agência/Conta inváido(s).');

    return account;
  } catch (err) {
    return { error: err.message };
  }
};

const doSelectAccountByConta = async conta => {
  try {
    const account = await accountModel
      .findOne({
        conta: conta,
      })
      .exec();

    if (!account) throw new Error(`Conta inváido(s). [ ${conta} ]`);

    return account;
  } catch (err) {
    return { error: err.message };
  }
};

export const selectAccount = async (agencia, conta) => {
  try {
    const account = await doSelectAccount(agencia, conta);

    return { balance: account.balance };
  } catch (err) {
    return { error: err.message };
  }
};

export const depositAccount = async (agencia, conta, value) => {
  try {
    const account = await doSelectAccount(agencia, conta);

    if (account.error) throw new Error(account.error);

    account.balance += value;
    account.save();
    return { balance: account.balance };
  } catch (err) {
    return { error: err.message };
  }
};

export const withdrawalAccount = async (agencia, conta, value) => {
  try {
    let saque = TARIFA_SAQUE + value;
    const account = await doSelectAccount(agencia, conta);

    if (account.error) throw new Error(account.error);

    if (saque > account.balance) throw new Error('Saldo insuficiente.');

    account.balance -= saque;
    account.save();
    return { balance: account.balance };
  } catch (err) {
    return { error: err.message };
  }
};

export const transferAccount = async (contaOrigem, contaDestino, value) => {
  try {
    const origemAccount = await doSelectAccountByConta(contaOrigem);
    const destinoAccount = await doSelectAccountByConta(contaDestino);

    if (origemAccount.error) throw new Error(origemAccount.error);
    if (destinoAccount.error) throw new Error(destinoAccount.error);

    let saque = value;
    if (origemAccount.agencia !== destinoAccount.agencia)
      saque += TARIFA_TRANSFERENCIA;

    if (saque > origemAccount.balance)
      throw new Error(`Saldo insuficiente na conta origem. [ ${contaOrigem} ]`);

    origemAccount.balance -= saque;
    destinoAccount.balance += value;

    origemAccount.save();
    destinoAccount.save();

    return { balance_origem: origemAccount.balance };
  } catch (err) {
    return { error: err.message };
  }
};
