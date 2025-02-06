import express from "express";
import routerHome from "./routes/home.route.js";
import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(routerHome);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
