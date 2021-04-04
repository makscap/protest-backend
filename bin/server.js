const app = require('../app');
const db = require('../db');
// require('dotenv').config();
const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log(`Server wasn't running. ${err.message}`);
});
