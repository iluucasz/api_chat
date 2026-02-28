require('dotenv').config();

const config = process.env.DATABASE_URL
   ? {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      dialectOptions: {
         ssl: {
            require: true,
            rejectUnauthorized: false
         }
      },
      define: {
         timestamps: true,
         underscored: true
      }
   }
   : {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      dialect: process.env.DB_DIALECT || 'postgres',
      define: {
         timestamps: true,
         underscored: true
      }
   };

module.exports = config;