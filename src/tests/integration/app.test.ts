import request from "supertest";
import server, { conectarDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";

describe("Autenticacion - Crear cuenta", () => {
  it("Debe mostrar los errores cuando el formulario se envia vacio", async () => {
    const res = await request(server).post("/api/auth/crear-cuenta").send({});

    const crearCuentaMock = jest.spyOn(AuthController, "crearCuenta");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(3);
    expect(res.status).not.toBe(201);
    expect(res.body.errores).not.toHaveLength(2);
    expect(crearCuentaMock).not.toHaveBeenCalled();
  });

  it("Debe regresar un codigo 400 cuando el correo no es valido", async () => {
    const res = await request(server).post("/api/auth/crear-cuenta").send({
      nombre: "Ariel",
      password: "12345678",
      correo: "corre_no_valido",
    });

    const crearCuentaMock = jest.spyOn(AuthController, "crearCuenta");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(1);
    expect(res.body.errores[0].msg).toBe("El correo no es válido");
    expect(res.status).not.toBe(201);
    expect(res.body.errores).not.toHaveLength(2);
    expect(crearCuentaMock).not.toHaveBeenCalled();
  });

  it("Debe regresar un codigo 400 cuando el password no tiene 8 caracteres", async () => {
    const res = await request(server).post("/api/auth/crear-cuenta").send({
      nombre: "Ariel",
      password: "1234",
      correo: "test@test.com",
    });

    const crearCuentaMock = jest.spyOn(AuthController, "crearCuenta");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(1);
    expect(res.body.errores[0].msg).toBe(
      "La contraseña debe tener al menos 8 caracteres"
    );
    expect(res.status).not.toBe(201);
    expect(res.body.errores).not.toHaveLength(2);
    expect(crearCuentaMock).not.toHaveBeenCalled();
  });

  it("Debe regresar un codigo 201 y el usuario debe registrarse", async () => {
    const datos = {
      nombre: "Prueba",
      password: "12345678",
      correo: "test@test.com",
    };

    const res = await request(server)
      .post("/api/auth/crear-cuenta")
      .send(datos);

    expect(res.status).toBe(201);
    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errores");
  });

  it("Debe regresar un codigo 409 y evitar registros duplicados", async () => {
    const datos = {
      nombre: "Prueba",
      password: "12345678",
      correo: "test@test.com",
    };

    const res = await request(server)
      .post("/api/auth/crear-cuenta")
      .send(datos);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Ya existe un usuario con ese correo");
    expect(res.status).not.toBe(201);
    expect(res.status).not.toBe(400);
  });
});
