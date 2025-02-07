import express from "express";
import routerHome from "./routes/home.route.js";
import routerUser from "./routes/user.route.js";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(routerHome);
app.use(routerUser);

sequelize
  .sync({
    force: false,
  })
  .then(() => {
    console.log("Base de datos sincronizada");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos", err);
  });
