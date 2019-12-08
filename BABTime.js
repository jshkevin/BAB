const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BABTPSchema = new Schema({
    id : String,
    date : String,
    placeName : String,
    startTime : String,
    endTime : String
});

module.exports = mongoose.model('BABTaP', BABTPSchema);