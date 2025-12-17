import { createRequest, createResponse } from "node-mocks-http";
import { presupuestos } from "../mocks/presupuestos";
import { PresupuestoController } from "../../controllers/PresupuestoController";
import Presupuesto from "../../models/Presupuesto";

jest.mock("../../models/Presupuesto", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

describe("PresupuestoController.obtener", () => {
  beforeEach(() => {
    (Presupuesto.findAll as jest.Mock).mockReset();
    (Presupuesto.findAll as jest.Mock).mockImplementation((options) => {
      const presupuestosActualizados = presupuestos.filter(
        (presupuesto) => presupuesto.idUsuario === options.where.idUsuario
      );

      return Promise.resolve(presupuestosActualizados);
    });
  });

  it("Debe regresar 2 presupuestos para el idUsuario: 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/presupuestos",
      usuario: {
        id: 1,
      },
    });

    const res = createResponse();
    await PresupuestoController.obtener(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(2);
    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(404);
  });

  it("Debe regresar 1 presupuesto para el idUsuario: 2", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/presupuestos",
      usuario: {
        id: 2,
      },
    });

    const res = createResponse();
    await PresupuestoController.obtener(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(1);
    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(404);
  });

  it("Debe regresar 0 presupuestos para el idUsuario: 10", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/presupuestos",
      usuario: {
        id: 10,
      },
    });

    const res = createResponse();
    await PresupuestoController.obtener(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(0);
    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(404);
  });

  it("Debe manejar los errores al obtener los presupuestos", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/presupuestos",
      usuario: {
        id: 100,
      },
    });

    const res = createResponse();
    (Presupuesto.findAll as jest.Mock).mockRejectedValue(new Error());
    await PresupuestoController.obtener(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Hubo un error" });
  });
});

describe("PresupuestoController.crear", () => {
  it("Debe crear un presupuesto y responder el statusCode 201", async () => {
    const presupuestoMock = {
      save: jest.fn().mockResolvedValue(true),
    };

    (Presupuesto.create as jest.Mock).mockResolvedValue(presupuestoMock);

    const req = createRequest({
      method: "POST",
      url: "/api/presupuestos",
      usuario: {
        id: 1,
      },
      body: {
        nombre: "Presupuesto Prueba",
        cantidad: 100,
      },
    });

    const res = createResponse();
    await PresupuestoController.crear(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(201);
    expect(data).toBe("Presupuesto creado correctamente");
    expect(presupuestoMock.save).toHaveBeenCalled();
    expect(presupuestoMock.save).toHaveBeenCalledTimes(1);
    expect(Presupuesto.create).toHaveBeenCalledWith(req.body);
  });

  it("Debe manejar los errores al crear los presupuestos", async () => {
    const presupuestoMock = {
      save: jest.fn(),
    };

    (Presupuesto.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/presupuestos",
      usuario: {
        id: 1,
      },
      body: {
        nombre: "Presupuesto Prueba",
        cantidad: 100,
      },
    });

    const res = createResponse();
    await PresupuestoController.crear(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un error" });
    expect(presupuestoMock.save).not.toHaveBeenCalled();
    expect(Presupuesto.create).toHaveBeenCalledWith(req.body);
  });
});

describe("PresupuestoController.obtenerPorId", () => {
  it("", async () => {});
});
