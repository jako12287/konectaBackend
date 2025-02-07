import { Sequelize } from "sequelize";

const sequelize = new Sequelize("konectabd", "johan", "Bellapajarita2024", {
  host: "localhost",
  dialect: "postgres",
  logging: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión BD establecida");
  })
  .catch((err) => {
    console.error("Hubo un error al conectar con la bd:", err);
  });

export default sequelize;
