import { sequelize } from "sequelize";

const sequelize = new sequelize("konectaBD", "johan", "Bellapajarita2024", {
  host: "localhost",
  dialect: "postgres",
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
