import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const db = new Sequelize(process.env.DB_URL, {
  models: [__dirname + "/../models/**/*"],
  logging: false,
  //   dialectOptions: {
  //     ssl: {
  //       require: false,
  //     },
  //   },
});
