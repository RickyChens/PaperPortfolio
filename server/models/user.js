const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    creationDate: {
        type: Date, required: true
    },
    user: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    balance: mongoose.Schema.Types.Decimal128,
    stocks: {
        type: [
            {
                stock: { type: String, required: true },
                amount: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 }
            }
        ],
        default: []
    },
    history: {
        type: [
            {
                date: { type: Date, required: true },
                balance: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 }
            }
        ],
        default: []
    },
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;