import express from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";
import presupuestoRouter from "./routes/presupuestoRouter";
import authRouter from "./routes/authRouter";

export async function conectarDB() {
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

app.use("/api/presupuestos", presupuestoRouter);
app.use("/api/auth", authRouter);

export default app;
