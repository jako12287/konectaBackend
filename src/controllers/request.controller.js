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

    const employee = await Employee.findByPk(id_employee);
    const { id, role } = req.user;

    if (role !== "admin" && id !== parseInt(id_employee)) {
      return res.status(403).json({
        message: {
          es: "Acceso no autorizado",
          en: "Unauthorized access",
        },
      });
    }

    if (!employee) {
      return res.status(404).json({
        error: {
          es: "El empleado no existe",
          en: "Employee not found",
        },
      });
    }

    const requests = await Request.findAll({
      where: {
        id_employee,
      },
    });

    res.status(200).json({
      message: {
        es: "Solicitudes obtenidas",
        en: "Requests fetched",
      },
      data: requests,
    });
  } catch (error) {
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
    const requests = await Request.findAll({
      include: [
        {
          model: Employee,
          attributes: ["id", "name", "email", "role", "salary", "entryDate"],
        },
      ],
    });

    res.status(200).json({
      message: {
        es: "Solicitudes obtenidas",
        en: "Requests fetched",
      },
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        es: "Error al obtener las solicitudes",
        en: "Error fetching requests",
      },
    });
  }
};
