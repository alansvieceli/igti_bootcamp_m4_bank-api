import { accountModel } from '../models/accountModel.js';

export const insertAccount = async value => {
  const account = new accountModel(value);

  let error = await account.validateSync();
  if (error) throw new Error(error.errors.name);

  await account.save();

  return account;
};

export const selectLowestBalanceByLimit = async count => {
  return await accountModel
    .find({}, 'agencia conta balance')
    .sort({ balance: 1 })
    .limit(count);
};

export const selectHighestBalanceByLimit = async count => {
  return await accountModel
    .find({}, 'agencia conta name balance')
    .sort({ balance: -1, nome: 1 })
    .limit(count);
};

export const selectHighestBalanceByAgencia = async agencia => {
  return await accountModel
    .findOne({ $and: [{ agencia: agencia }, { agencia: { $ne: 99 } }] })
    .sort({ balance: -1, nome: 1 });
};

export const selectByAgenciaContaAccount = async (agencia, conta) => {
  const account = await accountModel.findOne({
    agencia: agencia,
    conta: conta,
  });

  if (!account) throw new Error('Agência/Conta inváido(s).');

  return account;
};

export const selectByContaAccount = async conta => {
  const account = await accountModel.findOne({
    conta: conta,
  });

  if (!account) throw new Error(`Conta inváida. [ ${conta} ]`);

  return account;
};

export const selectByAgenciaAccount = async agencia => {
  return await accountModel.find({
    agencia: agencia,
  });
};

export const selectAllAgenciasNotPrivate = async () => {
  return await accountModel.distinct('agencia', { agencia: { $ne: 99 } });
};

export const averageAccount = async agencia => {
  const account = await accountModel.aggregate([
    { $match: { agencia: agencia } },
    { $group: { _id: null, total: { $avg: '$balance' } } },
  ]);

  if (!account) throw new Error(`Conta inváida. [ ${conta} ]`);

  return account[0].total;
};

export const deleteAccount = async (agencia, conta) => {
  await accountModel.deleteOne({
    agencia: agencia,
    conta: conta,
  });
};
