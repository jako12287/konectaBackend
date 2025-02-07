import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "employees",
    timestamps: false,
  }
);

export default Employee;
