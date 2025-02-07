import bcrypt from "bcryptjs";
import Employee from "../models/employee.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, salary, entryDate, password, role, email } = req.body;

  if (!name || !salary || !entryDate || !password || !email) {
    return res.status(400).json({
      error: {
        es: "Todos los campos son obligatorios",
        en: "All fields are required",
      },
    });
  }
  try {
    const existingUser = await Employee.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: {
          es: "El usuario con este email ya existe",
          en: "A user with this email already exists",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    if (role && role !== "employee" && role !== "admin") {
      return res.status(400).json({
        error: {
          es: "Rol inválido. Debe ser 'employee' o 'admin'",
          en: "Invalid role. Must be 'employee' or 'admin'",
        },
      });
    }

    const user = await Employee.create({
      name,
      salary,
      entryDate,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "employee",
    });

    res.status(201).json({
      message: {
        es: "Usuario registrado con éxito",
        en: "Employee registered successfully",
      },
      user,
    });
  } catch (error) {
    console.log("Registro de empleados", error);
    res.status(500).json({
      error: {
        es: "Hubo un error al registrar el empleado",
        en: "An error occurred while registering the employee",
      },
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ where: { email } });

    if (!employee) {
      return res.status(404).json({
        error: {
          es: "Revisa tus credenciales",
          en: "Check your credentials",
        },
      });
    }

    const passwordIsValid = await bcrypt.compare(password, employee.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        error: {
          es: "Revisa tus credenciales",
          en: "Check your credentials",
        },
      });
    }
    const secret = process.env.SECRET_KEY || "konecta";
    const token = jwt.sign(
      {
        id: employee.id,
        role: employee.role,
      },
      secret,
      {
        expiresIn: "24h",
      }
    );
    res.json({
      message: {
        es: "Bienvenido Inicio de sesión exitoso",
        en: "Welcome Successful login",
      },
      user: {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        email: employee.email,
      },
      token,
    });
  } catch (error) {}
};
