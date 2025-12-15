import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Gasto from "./Gasto";
import Usuario from "./Usuario";

@Table({
  tableName: "presupuestos",
})
class Presupuesto extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare nombre: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
  })
  declare cantidad: number;

  @HasMany(() => Gasto, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare gastos: Gasto[];

  @ForeignKey(() => Usuario)
  declare idusuario: number;

  @BelongsTo(() => Usuario)
  declare usuario: Usuario;
}

export default Presupuesto;
