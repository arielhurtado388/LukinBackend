import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  AllowNull,
} from "sequelize-typescript";
import Presupuesto from "./Presupuesto";

@Table({
  tableName: "gastos",
})
class Gasto extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare nombre: string;

  @AllowNull(false)
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
