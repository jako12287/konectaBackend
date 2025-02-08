import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión BD establecida");
  })
  .catch((error) => {
    console.error("Hubo un error al conectar con la bd:", error);
  });

export default sequelize;
