import request from "supertest";
import { app } from "../index.js";

describe("Autentications", () => {
  it("Debe permitir el inicio de sesión con credenciales válidas", async () => {
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
