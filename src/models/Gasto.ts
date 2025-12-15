import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Presupuesto from "./Presupuesto";

@Table({
  tableName: "gastos",
})
class Gasto extends Model {
  @Column({
    type: DataType.STRING(60),
  })
  declare nombre: string;

  @Column({
    type: DataType.DECIMAL,
  })
  declare cantidad: number;

  @ForeignKey(() => Presupuesto)
  declare idPresupuesto: number;

  @BelongsTo(() => Presupuesto)
  declare presupuesto: Presupuesto;
}

export default Gasto;
