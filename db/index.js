const mongoose = require('mongoose');

require('dotenv').config();
const uriDb = process.env.DB_HOST;

const db = mongoose.connect(uriDb, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log('Database connection successful');
});
mongoose.connection.on('error', err => {
  console.log(`Couldn't connect to Database ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
  console.log(`Have been disconnected from the Database`);
});
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Connection to Database was closed, App is terminated');
  process.exit(1);
});
module.exports = db;
