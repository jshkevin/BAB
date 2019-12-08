const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    pw: String,
    email : String
    // salt: String
});

module.exports = mongoose.model('BABuser', userSchema);