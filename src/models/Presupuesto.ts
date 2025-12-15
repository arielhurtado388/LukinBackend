import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Gasto from "./Gasto";

@Table({
  tableName: "presupuestos",
})
class Presupuesto extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  declare nombre: string;

  @Column({
    type: DataType.DECIMAL,
  })
  declare cantidad: number;

  @HasMany(() => Gasto, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare gastos: Gasto[];
}

export default Presupuesto;
