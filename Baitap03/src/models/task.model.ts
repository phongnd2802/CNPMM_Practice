import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import sequelize from "../config/database";
interface TaskAttributes {
  id: number;
  title: string;
  description?: string;
  done: boolean;
}
interface TaskCreationAttributes extends Optional<TaskAttributes, "id"> {}
class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public title!: string;
  public description?: string;
  public done!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Task.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    done: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, tableName: "tasks" }
);
export default Task;
