const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// (LOCAL BOLSA USINI QOSAMIZ )PostgreSQL menen baylanıs ornatıw
// const sequelize = new Sequelize(
//     process.env.DB_NAME, // Baza atı (nokis_ijara)
//     process.env.DB_USER, // Paydalanıwshı (postgres)
//     process.env.DB_PASS, // Parol
//     {
//         host: process.env.DB_HOST,
//         dialect: 'postgres', // Biz Postgres qollanamız
//         logging: false, // Konsolga artıqsha SQL zaproslardı shıǵarmaw ushın
//     }
// );

// RENDER USHIN
// Render uchun DATABASE_URL dan foydalanamiz
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Bu Render uchun shart
    },
  },
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL bazasına tabıslı jalǵandı!");
  } catch (error) {
    console.error("Bazaǵa jalǵanıwda qátelik:", error);
    process.exit(1);
  }
};

// sequelize obyektin eksport qılamız (Model jazǵanda kerek boladı)
module.exports = { sequelize, connectDB };
