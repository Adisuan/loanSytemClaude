const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("../config");
mongoose.connect(MONGO_DB_URL, {});
// let db = mongoose.connection;
// db.on('error', function (e) {
//   console.log('mongodb connection error');
//   // console.error.bind(console, 'connection error:')
// });
// db.once('open', function () {
//   // console.log('mongodb connect');
// });

module.exports = mongoose;
