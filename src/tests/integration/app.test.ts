import request from "supertest";
import server, { conectarDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";
import Usuario from "../../models/Usuario";
import * as authHelpers from "../../helpers/auth";
import * as jwtHelpers from "../../helpers/jwt";

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

describe("Autenticacion - Confirmar cuenta con token", () => {
  it("Debe mostrar el error si el token esta vacio o no es valido", async () => {
    const res = await request(server).post("/api/auth/confirmar-cuenta").send({
      token: "not_valid",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(1);
    expect(res.body.errores[0].msg).toBe("El código no es válido");
  });

  it("Debe verificar que el token existe", async () => {
    const res = await request(server).post("/api/auth/confirmar-cuenta").send({
      token: "123456",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("El código no es válido");
    expect(res.status).not.toBe(200);
  });

  it("Debe confirmar la cuenta con el token valido y existente", async () => {
    const token = globalThis.tokenConfirmacionLukin;
    const res = await request(server).post("/api/auth/confirmar-cuenta").send({
      token,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("Cuenta confirmada correctamente");
    expect(res.status).not.toBe(401);
  });
});

describe("Autenticacion - Iniciar sesion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe mostrar los errores de validacion cuando se envia el formulario vacio", async () => {
    const res = await request(server).post("/api/auth/iniciar-sesion").send({});

    const iniciarSesionMock = jest.spyOn(AuthController, "iniciarSesion");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(2);
    expect(res.body.errores).not.toHaveLength(1);
    expect(iniciarSesionMock).not.toHaveBeenCalled();
  });

  it("Debe mostrar el error 400 cuando el correo no es valido", async () => {
    const res = await request(server).post("/api/auth/iniciar-sesion").send({
      correo: "not_valid",
      password: "12345678",
    });

    const iniciarSesionMock = jest.spyOn(AuthController, "iniciarSesion");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(1);
    expect(res.body.errores[0].msg).toBe("El correo no es válido");
    expect(res.body.errores).not.toHaveLength(2);
    expect(iniciarSesionMock).not.toHaveBeenCalled();
  });

  it("Debe mostrar el error 400 si el usuario no es encontrado", async () => {
    const res = await request(server).post("/api/auth/iniciar-sesion").send({
      correo: "usuario_no_encontrado@test.com",
      password: "12345678",
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Usuario no encontrado");
    expect(res.status).not.toBe(200);
  });

  it("Debe mostrar el error 403 si el usuario no esta confirmado", async () => {
    (jest.spyOn(Usuario, "findOne") as jest.Mock).mockResolvedValue({
      id: 1,
      correo: "usuario_no_confirmado@test.com",
      password: "hashedpassword",
      confirmado: false,
    });

    const res = await request(server).post("/api/auth/iniciar-sesion").send({
      correo: "usuario_no_confirmado@test.com",
      password: "12345678",
    });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Cuenta no confirmada");
    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(404);
  });

  it("Debe mostrar el error 403 si el usuario no esta confirmado", async () => {
    const datos = {
      nombre: "Prueba",
      correo: "usuario_no_confirmado@test.com",
      password: "12345678",
    };

    await request(server).post("/api/auth/crear-cuenta").send(datos);

    const res = await request(server).post("/api/auth/iniciar-sesion").send({
      correo: datos.correo,
      password: datos.password,
    });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Cuenta no confirmada");
    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(404);
  });

  it("Debe mostrar el error 401 si la contraseña no es correcta", async () => {
    const findOne = (
      jest.spyOn(Usuario, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      password: "hashedPassword",
      confirmado: true,
    });

    const verificarPassword = jest
      .spyOn(authHelpers, "verificarPassword")
      .mockResolvedValue(false);

    const res = await request(server).post("/api/auth/iniciar-sesion").send({
      correo: "test@test.com",
      password: "passwordIncorrecto",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Contraseña incorrecta");
    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(403);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(verificarPassword).toHaveBeenCalledTimes(1);
  });

  it("Debe generar y verificar el JWT", async () => {
    const findOne = (
      jest.spyOn(Usuario, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      password: "hashedPassword",
      confirmado: true,
    });

    const verificarPassword = jest
      .spyOn(authHelpers, "verificarPassword")
      .mockResolvedValue(true);

    const generarJWT = jest
      .spyOn(jwtHelpers, "generarJWT")
      .mockReturnValue("jwt_token");

    const res = await request(server).post("/api/auth/iniciar-sesion").send({
      correo: "test@test.com",
      password: "passwordCorrecto",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual("jwt_token");
    expect(findOne).toHaveBeenCalled();
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(verificarPassword).toHaveBeenCalled();
    expect(verificarPassword).toHaveBeenCalledTimes(1);
    expect(verificarPassword).toHaveBeenCalledWith(
      "passwordCorrecto",
      "hashedPassword"
    );
    expect(generarJWT).toHaveBeenCalled();
    expect(generarJWT).toHaveBeenCalledTimes(1);
    expect(generarJWT).toHaveBeenCalledWith(1);
  });
});

describe("GET /api/presupuestos", () => {
  let jwt: string;

  beforeAll(() => {
    jest.restoreAllMocks(); // Restaura los jest.spyOn a su implementacion original
  });

  beforeAll(async () => {
    const response = await request(server)
      .post("/api/auth/iniciar-sesion")
      .send({
        correo: "test@test.com",
        password: "12345678",
      });
    jwt = response.body;
    expect(response.status).toBe(200);
  });

  it("Debe rechazar usuarios no autenticados y sin jwt", async () => {
    const res = await request(server).get("/api/presupuestos");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("No autorizado");
  });

  it("Debe rechazar usuarios no autenticados y con jwt que no es valido", async () => {
    const res = await request(server)
      .get("/api/presupuestos")
      .auth("jwt_no_valido", { type: "bearer" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("El código no es válido");
  });

  it("Debe permitir acceso autenticado y con jwt valido", async () => {
    const res = await request(server)
      .get("/api/presupuestos")
      .auth(jwt, { type: "bearer" });

    expect(res.status).not.toBe(401);
    expect(res.body.error).not.toBe("No autorizado");
    expect(res.body).toHaveLength(0);
  });
});

describe("POST /api/presupuestos", () => {
  let jwt: string;

  beforeAll(async () => {
    const response = await request(server)
      .post("/api/auth/iniciar-sesion")
      .send({
        correo: "test@test.com",
        password: "12345678",
      });
    jwt = response.body;
    expect(response.status).toBe(200);
  });
});
