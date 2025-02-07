import { Op } from "sequelize";
import Employee from "../models/employee.js";

export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, name } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const where = {};
    if (role) where.role = role;
    if (name) where.name = { [Op.iLike]: `%${name}%` };

    const { count, rows } = await Employee.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
    });

    res.json({
      total: count,
      page: pageNumber,
      totalPages: Math.ceil(count / limitNumber),
      employees: rows,
    });
  } catch (error) {
    console.error("Error en getEmployees:", error);
    res.status(500).json({
      error: {
        es: "Error al obtener empleados",
        en: "Error fetching employees",
      },
    });
  }
};
