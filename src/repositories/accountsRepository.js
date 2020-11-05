import { accountModel } from '../models/accountModel.js';

export const insertAccount = async value => {
  const account = new accountModel(value);

  let error = await account.validateSync();
  if (error) throw new Error(error.errors.name);

  await account.save();

  return account;
};

export const selectByAgenciaContaAccount = async (agencia, conta) => {
  const account = await accountModel
    .findOne({
      agencia: agencia,
      conta: conta,
    })
    .exec();

  if (!account) throw new Error('Agência/Conta inváido(s).');

  return account;
};

export const selectByContaAccount = async conta => {
  try {
    const account = await accountModel
      .findOne({
        conta: conta,
      })
      .exec();

    if (!account) throw new Error(`Conta inváida. [ ${conta} ]`);

    return account;
  } catch (err) {
    return { error: err.message };
  }
};
