import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";

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
}

export default Presupuesto;
