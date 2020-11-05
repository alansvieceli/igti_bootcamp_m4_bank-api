import mongoose from 'mongoose';
const { Schema } = mongoose;

const accountSchema = Schema({
  agencia: {
    type: Number,
    required: [true, 'Faltou definir Agência'],
  },
  conta: {
    type: Number,
    required: [true, 'Faltou definir Conta'],
  },
  name: {
    type: String,
    required: [true, 'Faltou definir Nome'],
  },
  balance: {
    type: Number,
    min: [0, 'Saldo não pode ser negativo'],
  },
});

const accountModel = mongoose.model('account', accountSchema); //vai por s no final
//mongoose.model('account', accountSchema, 'account'); // não bota o s

export { accountModel };
