import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import Usuario from "../../../models/Usuario";
import { hashPassword } from "../../../helpers/auth";
import { generarToken } from "../../../helpers/token";
import { AuthCorreo } from "../../../correos/AuthCorreo";

jest.mock("../../../models/Usuario");
jest.mock("../../../helpers/auth");
jest.mock("../../../helpers/token");

describe("AuthController.crearCuenta", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Debe regresar 409 y un mensaje de error", async () => {
    (Usuario.findOne as jest.Mock).mockResolvedValue(true);

    const req = createRequest({
      method: "POST",
      url: "/api/aut/crear-cuenta",
      body: {
        correo: "prueba@prueba.com",
        password: "testpassword",
      },
    });

    const res = createResponse();
    await AuthController.crearCuenta(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(409);
    expect(data).toHaveProperty("error", "Ya existe un usuario con ese correo");
    expect(Usuario.findOne).toHaveBeenCalled();
    expect(Usuario.findOne).toHaveBeenCalledTimes(1);
  });

  it("Debe crear un usuario y devolver un mensaje de exito", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/aut/crear-cuenta",
      body: {
        nombre: "Prueba",
        correo: "prueba@prueba.com",
        password: "testpassword",
      },
    });

    const res = createResponse();

    const usuarioMock = {
      ...req.body,
      save: jest.fn(),
    };

    (Usuario.create as jest.Mock).mockResolvedValue(usuarioMock);
    (hashPassword as jest.Mock).mockResolvedValue("hashedpassword");
    (generarToken as jest.Mock).mockReturnValue("123456");
    jest
      .spyOn(AuthCorreo, "enviarConfirmacion")
      .mockImplementation(() => Promise.resolve());

    await AuthController.crearCuenta(req, res);

    const data = res._getJSONData();
    expect(Usuario.create).toHaveBeenCalledWith(req.body);
    expect(Usuario.create).toHaveBeenCalledTimes(1);
    expect(usuarioMock.save).toHaveBeenCalled();
    expect(usuarioMock.password).toBe("hashedpassword");
    expect(usuarioMock.token).toBe("123456");
    expect(AuthCorreo.enviarConfirmacion).toHaveBeenCalledWith({
      nombre: req.body.nombre,
      correo: req.body.correo,
      token: "123456",
    });
    expect(AuthCorreo.enviarConfirmacion).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(201);
  });
});
