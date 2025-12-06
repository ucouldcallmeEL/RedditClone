const { databaseConnection } = require('./DBmanager');

databaseConnection()
  .then(() => {
    console.log('Connection OK');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Connection Error', err);
    process.exit(1);
  });