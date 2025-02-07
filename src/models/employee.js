import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    salary: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("employee", "admin"),
      allowNull: false,
      defaultValue: "employee",
    },
  },
  {
    tableName: "employees",
    timestamps: false,
  }
);

export default Employee;
