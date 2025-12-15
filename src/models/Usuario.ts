import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  Unique,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import Presupuesto from "./Presupuesto";

@Table({
  tableName: "usuarios",
})
export class Usuario extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare nombre: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare password: string;

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare correo: string;

  @Column({
    type: DataType.STRING(6),
  })
  declare token: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare confirmado: boolean;

  @HasMany(() => Presupuesto, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare presupuestos: Presupuesto[];
}

export default Usuario;
