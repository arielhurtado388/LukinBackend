import express from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";

async function conectarDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.magenta.bold("Conexión exitosa a la DB"));
  } catch (error) {
    console.log(colors.red.bold("Falló la conexión a la DB"));
  }
}

conectarDB();

const app = express();

app.use(morgan("dev"));

app.use(express.json());

export default app;
