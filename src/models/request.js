import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Employee from "./employee.js";

const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    summary: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    id_employee: {
      type: DataTypes.INTEGER,
      references: {
        model: "employees",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "requests",
    timestamps: false,
  }
);

Request.belongsTo(Employee, { foreignKey: "id_employee" });

export default Request;
