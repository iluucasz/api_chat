require('dotenv').config();

const config = {
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB,
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   dialect: process.env.DB_DIALECT,
   define: {
      timestamps: true,
      underscored: true
   }
};

module.exports = config;