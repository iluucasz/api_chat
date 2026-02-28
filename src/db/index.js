const Sequelize = require('sequelize')
const configDB = require('../db/config/database')
const User = require('./models/user')

let connection;
if (process.env.DATABASE_URL) {
   connection = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: configDB.dialectOptions,
      define: configDB.define,
      logging: false
   });
} else {
   connection = new Sequelize(configDB);
}

User.init(connection)

module.exports = connection