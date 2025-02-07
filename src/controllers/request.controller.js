import Employee from "../models/employee.js";
import Request from "../models/request.js";

export const createRequest = async (req, res) => {
  try {
    const { code, description, summary, id_employee } = req.body;

    const employee = await Employee.findByPk(id_employee);

    if (!employee) {
      return res.status(404).json({
        error: {
          es: "El empleado no existe",
          en: "Employee not found",
        },
      });
    }

    const newRequest = await Request.create({
      code,
      description,
      summary,
      id_employee,
    });

    res.status(201).json({
      message: { es: "Solicitud creada", en: "Request created" },
      data: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        es: "Error al crear la solicitud",
        en: "Error creating request",
      },
    });
  }
};

export const getRequestsByEmployee = async (req, res) => {
  try {
    const { id_employee } = req.params;
    const { id, role } = req.user;
    const { page = 1, limit = 10, code } = req.query;

    if (role !== "admin" && id !== parseInt(id_employee)) {
      return res.status(403).json({
        message: {
          es: "Acceso no autorizado",
          en: "Unauthorized access",
        },
      });
    }

    const employee = await Employee.findByPk(id_employee);
    if (!employee) {
      return res.status(404).json({
        error: {
          es: "El empleado no existe",
          en: "Employee not found",
        },
      });
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const where = { id_employee };
    if (code) where.code = { [Op.iLike]: `%${code}%` };

    const { count, rows } = await Request.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
    });

    res.status(200).json({
      total: count,
      page: pageNumber,
      totalPages: Math.ceil(count / limitNumber),
      requests: rows,
    });
  } catch (error) {
    console.error("Error en getRequestsByEmployee:", error);
    res.status(500).json({
      error: {
        es: "Error al obtener las solicitudes",
        en: "Error fetching requests",
      },
    });
  }
};

export const getRequestsAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, code } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const where = {};

    if (code) where.code = { [Op.iLike]: `%${code}%` };

    const { count, rows } = await Request.findAndCountAll({
      where,
      include: [
        {
          model: Employee,
          attributes: ["id", "name", "email", "role", "salary", "entryDate"],
        },
      ],
      limit: limitNumber,
      offset,
    });

    res.status(200).json({
      total: count,
      page: pageNumber,
      totalPages: Math.ceil(count / limitNumber),
      requests: rows,
    });
  } catch (error) {
    console.error("Error en getRequestsAll:", error);
    res.status(500).json({
      error: {
        es: "Error al obtener las solicitudes",
        en: "Error fetching requests",
      },
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id_request } = req.params;

    const request = await Request.findByPk(id_request);

    if (!request) {
      return res.status(404).json({
        error: {
          es: "La solicitud no existe",
          en: "Request not found",
        },
      });
    }

    await request.destroy();
    return res.status(200).json({
      message: {
        es: "Solicitud eliminada",
        en: "Request deleted",
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        es: "Error al eliminar la solicitud",
        en: "Error deleting request",
      },
    });
  }
};
