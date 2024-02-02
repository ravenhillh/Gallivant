const { Sequelize } = require('sequelize');

const db = new Sequelize('gallivant', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  })
  

db.authenticate()
 .then(() => {
    console.log('Connection has been established successfully.');
})
 .catch ((error: string) => {
    console.error('Unable to connect to the database:', error);
})

export default db