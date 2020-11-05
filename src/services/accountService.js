import {
  insertAccount,
  selectByAgenciaContaAccount,
  selectByContaAccount,
  averageAccount,
  selectLowestBalanceByLimit,
  selectHighestBalanceByLimit,
  selectAllAgenciasNotPrivate,
  selectHighestBalanceByAgencia,
  selectByAgenciaAccount,
  deleteAccount,
} from '../repositories/accountsRepository.js';

const TARIFA_SAQUE = 1;
const TARIFA_TRANSFERENCIA = 8;

export const insert = async json => {
  try {
    return await insertAccount(json);
  } catch (err) {
    return { error: err.message };
  }
};

export const deposit = async json => {
  try {
    const { agencia, conta, value } = json;

    console.log(json);
    console.log(agencia);
    console.log(conta);
    console.log(value);

    const account = await selectByAgenciaContaAccount(agencia, conta);

    if (account.error) throw new Error(account.error);

    account.balance += value;
    account.save();

    return { balance: account.balance };
  } catch (err) {
    return { error: err.message };
  }
};

export const withdrawal = async json => {
  try {
    const { agencia, conta, value } = json;

    let saque = TARIFA_SAQUE + value;
    const account = await selectByAgenciaContaAccount(agencia, conta);

    if (account.error) throw new Error(account.error);

    if (saque > account.balance) throw new Error('Saldo insuficiente.');

    account.balance -= saque;
    account.save();

    return { balance: account.balance };
  } catch (err) {
    return { error: err.message };
  }
};

export const selectByAgenciaConta = async (agencia, conta) => {
  try {
    return await selectByAgenciaContaAccount(agencia, conta);
  } catch (err) {
    return { error: err.message };
  }
};

export const transfer = async json => {
  try {
    const { conta_origem, conta_destino, value } = json;

    const origemAccount = await selectByContaAccount(conta_origem);
    const destinoAccount = await selectByContaAccount(conta_destino);

    if (origemAccount.error) throw new Error(origemAccount.error);
    if (destinoAccount.error) throw new Error(destinoAccount.error);

    let saque = value;
    if (origemAccount.agencia !== destinoAccount.agencia)
      saque += TARIFA_TRANSFERENCIA;

    if (saque > origemAccount.balance)
      throw new Error(
        `Saldo insuficiente na conta origem. [ ${conta_origem} ]`
      );

    origemAccount.balance -= saque;
    destinoAccount.balance += value;

    origemAccount.save();
    destinoAccount.save();

    return { balance_origem: origemAccount.balance };
  } catch (err) {
    return { error: err.message };
  }
};

export const average = async agencia => {
  try {
    const avg = await averageAccount(Number(agencia));
    return { avg: avg };
  } catch (err) {
    return { error: err.message };
  }
};

export const lowestBalance = async count => {
  try {
    return await selectLowestBalanceByLimit(Number(count));
  } catch (err) {
    return { error: err.message };
  }
};

export const highestBalance = async count => {
  try {
    return await selectHighestBalanceByLimit(Number(count));
  } catch (err) {
    return { error: err.message };
  }
};

export const transferPrivate = async () => {
  try {
    const agenciasList = await selectAllAgenciasNotPrivate();

    for (const agencia of agenciasList) {
      const account = await selectHighestBalanceByAgencia(agencia);
      account.agencia = 99;
      await account.save();
    }

    let account = await selectByAgenciaAccount(99);
    if (!account) account = [];

    return account;
  } catch (err) {
    return { error: err.message };
  }
};

export const deleteByAgenciaConta = async (agencia, conta) => {
  try {
    await deleteAccount(agencia, conta);
    return await selectByAgenciaAccount(agencia);
  } catch (err) {
    return { error: err.message };
  }
};
