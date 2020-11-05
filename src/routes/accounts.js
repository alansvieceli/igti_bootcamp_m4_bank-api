import express from 'express';

import { logger } from '../modules/log.js';
import {
  insertAccount,
  depositAccount,
  withdrawalAccount,
  selectAccount,
  transferAccount,
} from '../modules/repository.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  res.send('OK');
});

router.post('/', async (req, res, next) => {
  const data = await insertAccount(req.body);

  if (data.error !== undefined) {
    next(data.error);
  } else {
    res.send(data);
  }
});

/*
Crie um endpoint para registrar um depósito em uma conta. Este endpoint deverá
receber como parâmetros a “agencia”, o número da conta e o valor do depósito. Ele
deverá atualizar o “balance” da conta, incrementando-o com o valor recebido como
parâmetro. O endpoint deverá validar se a conta informada existe, caso não exista
deverá retornar um erro, caso exista retornar o saldo atual da conta.
*/
router.patch('/deposit', async (req, res, next) => {
  const data = await depositAccount(
    req.body.agencia,
    req.body.conta,
    req.body.value
  );

  if (data.error !== undefined) {
    next(data.error);
  } else {
    res.send(data);
  }
});

/*
Crie um endpoint para registrar um saque em uma conta. Este endpoint deverá
receber como parâmetros a “agência”, o número da conta e o valor do saque. Ele
deverá atualizar o “balance” da conta, decrementando-o com o valor recebido com
parâmetro e cobrando uma tarifa de saque de (1). O endpoint deverá validar se a
conta informada existe, caso não exista deverá retornar um erro, caso exista retornar
o saldo atual da conta. Também deverá validar se a conta possui saldo suficiente
para aquele saque, se não tiver deverá retornar um erro, não permitindo assim que
o saque fique negativo.
*/
router.patch('/withdrawal', async (req, res, next) => {
  const data = await withdrawalAccount(
    req.body.agencia,
    req.body.conta,
    req.body.value
  );

  if (data.error !== undefined) {
    next(data.error);
  } else {
    res.send(data);
  }
});

/*
Crie um endpoint para consultar o saldo da conta. Este endpoint deverá receber
como parâmetro a “agência” e o número da conta, e deverá retornar seu “balance”.
Caso a conta informada não exista, retornar um erro.
*/
router.get('/:agencia/:conta', async (req, res, next) => {
  const data = await selectAccount(req.params.agencia, req.params.conta);
  if (data.error !== undefined) {
    next(data.error);
  } else {
    res.send(data);
  }
});

/*
Crie um endpoint para excluir uma conta. Este endpoint deverá receber como
parâmetro a “agência” e o número da conta e retornar o número de contas ativas
para esta agência.
*/

/*
Crie um endpoint para realizar transferências entre contas. Este endpoint deverá
receber como parâmetro o número da “conta” origem, o número da “conta” destino e
o valor de transferência. Este endpoint deve validar se as contas são da mesma
agência para realizar a transferência, caso seja de agências distintas o valor de 
tarifa de transferência (8) deve ser debitado na conta origem. O endpoint deverá 
retornar o saldo da conta origem.
*/
router.patch('/transfer', async (req, res, next) => {
  const data = await transferAccount(
    req.body.conta_origem,
    req.body.conta_destino,
    req.body.value
  );

  if (data.error !== undefined) {
    next(data.error);
  } else {
    res.send(data);
  }
});

/*
Crie um endpoint para consultar a média do saldo dos clientes de determinada
agência. O endpoint deverá receber como parâmetro a “agência” e deverá retornar
o balance médio da conta.
*/

/*
Crie um endpoint para consultar os clientes com o menor saldo em conta. O endpoint
deverá receber como parâmetro um valor numérico para determinar a quantidade de
clientes a serem listados, e o endpoint deverá retornar em ordem crescente pelo
saldo a lista dos clientes (agência, conta, saldo).
*/

/*
Crie um endpoint para consultar os clientes mais ricos do banco. O endpoint deverá
receber como parâmetro um valor numérico para determinar a quantidade de clientes
a serem listados, e o endpoint deverá retornar em ordem decrescente pelo saldo,
crescente pelo nome, a lista dos clientes (agência, conta, nome e saldo).
*/

/*
Crie um endpoint que irá transferir o cliente com maior saldo em conta de cada
agência para a agência private agencia=99. O endpoint deverá retornar a lista dos
clientes da agencia private.
*/

//tratamento de todos os erros q derem acima, e usaram
router.use((err, req, res, next) => {
  logger.error(`${req.method} - ${req.baseUrl}`);
  logger.error(err);
  res.status(400).send({ error: err });
});

export default router;
