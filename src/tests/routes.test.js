import request from "supertest";
import { app } from "../index.js";
import Employee from "../models/employee.js";
import { beforeAll, beforeEach, jest } from "@jest/globals";

jest.unstable_mockModule("../utils/middlewares/auth.js", () => ({
  verifyAdmin: jest.fn((req, res, next) => next()),
  verifyUser: jest.fn((req, res, next) => next()),
}));

let token;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "konecta@gmail.com", password: "123456" });
  token = res.body.token;
});

// Test para autenticacion /api/auth/login
describe("Autentications", () => {
  it("Debe permitir el inicio de sesión con credenciales válidas", async () => {
    expect(token).toBeDefined();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "konecta@gmail.com", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("Debe rechazar credenciales incorrectas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "konecta@gmail.com", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});

//Test paraa registro de los empleados por el adminitrador
describe("Registro de empleados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe registrar un usuario con datos válidos", async () => {
    jest.spyOn(Employee, "findOne").mockResolvedValue(null);
    jest.spyOn(Employee, "create").mockResolvedValue({
      id: 1,
      name: "John Doe",
      salary: 5000,
      entryDate: "2024-02-01",
      email: "johndoe@gmail.com",
      role: "employee",
    });

    const res = await request(app)
      .post("/api/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        salary: 5000,
        entryDate: "2024-02-01",
        email: "johndoe@gmail.com",
        password: "securePass123",
        role: "employee",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.es).toBe("Usuario registrado con éxito");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
  });

  it("Debe rechazar la solicitud si faltan campos obligatorios", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "John Doe", salary: 5000, entryDate: "2024-02-01" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.es).toBe("Todos los campos son obligatorios");
  });

  it("Debe rechazar el registro si el email ya existe", async () => {
    jest.spyOn(Employee, "findOne").mockResolvedValue({ id: 1 });

    const res = await request(app)
      .post("/api/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        salary: 5000,
        entryDate: "2024-02-01",
        email: "johndoe@gmail.com",
        password: "securePass123",
        role: "employee",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.es).toBe("El usuario con este email ya existe");
  });
});

//Test para obtener lista de empleados de GET /api/employees
describe("GET Employess", () => {
  it("Debe obtener una lista de empleados", async () => {
    const res = await request(app)
      .get("/api/employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("employees");
    expect(res.body.employees).toBeInstanceOf(Array);
    expect(res.body.employees[0]).toHaveProperty("id");
    expect(res.body.employees[0]).toHaveProperty("name");
    expect(res.body.employees[0]).toHaveProperty("role");
  });

  it("Debe permitir que un administrador obtenga una lista de empleados", async () => {
    const res = await request(app)
      .get("/api/employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("employees");
    expect(res.body.employees).toBeInstanceOf(Array);
    expect(res.body.employees.length).toBeGreaterThan(0);
  });

  it("Debe manejar correctamente la paginación de empleados", async () => {
    const res = await request(app)
      .get("/api/employees?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body.totalPages).toBeGreaterThan(0);
    expect(res.body.employees).toHaveLength(1);
  });

  it("Debe filtrar empleados por rol", async () => {
    const res = await request(app)
      .get("/api/employees?role=admin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("employees");
    expect(res.body.employees).toBeInstanceOf(Array);
    expect(res.body.employees.every((emp) => emp.role === "admin")).toBe(true); // Verifica que todos los empleados tengan el rol "admin"
  });

  it("Debe filtrar empleados por nombre", async () => {
    const res = await request(app)
      .get("/api/employees?name=John")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("employees");
    expect(res.body.employees).toBeInstanceOf(Array);
    expect(res.body.employees.every((emp) => emp.name.includes("John"))).toBe(
      true
    ); // Verifica que todos los nombres contengan "John"
  });

  it("Debe manejar errores internos si algo sale mal", async () => {
    jest
      .spyOn(Employee, "findAndCountAll")
      .mockRejectedValueOnce(new Error("Database error"));

    const res = await request(app)
      .get("/api/employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.error.es).toBe("Error al obtener empleados");
  });
});

//Test para las solicitudes
describe("POST /api/request", () => {
  it("Debe crear una solicitud si el empleado existe", async () => {
    const res = await request(app)
      .post("/api/request")
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "REQ001",
        description: "Solicitud de ejemplo",
        summary: "Resumen de la solicitud",
        id_employee: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toHaveProperty("es", "Solicitud creada");
  });
});

//Test para obtener las solicitudes de un empleado
describe("GET /api/request/:id_employee", () => {
  it("Debe devolver las solicitudes del empleado si el usuario tiene acceso", async () => {
    const res = await request(app)
      .get("/api/request/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("requests");
  });
});

//Test para obtener las solicitudes de un administrador

describe("GET /api/request/admin/all", () => {
  it("Debe devolver todas las solicitudes si el usuario es admin", async () => {
    const res = await request(app)
      .get("/api/request/admin/all")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("requests");
  });
});

//Test para eliminar solicitud dado un id de la solicitud

describe("DELETE /api/request/:id_request", () => {
  it("Debe eliminar la solicitud si existe", async () => {
    const res = await request(app)
      .delete("/api/request/1") 
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toHaveProperty("es", "Solicitud eliminada");
  });

  it("Debe devolver un error si la solicitud no existe", async () => {
    const res = await request(app)
      .delete("/api/request/9999") 
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toHaveProperty("es", "La solicitud no existe");
  });
});
