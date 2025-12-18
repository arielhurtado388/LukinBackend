import { createRequest, createResponse } from "node-mocks-http";
import Gasto from "../../../models/Gasto";
import { GastoController } from "../../../controllers/GastoController";

jest.mock("../../../models/Gasto", () => ({
  create: jest.fn(),
}));

describe("GastoController.crear", () => {
  it("Debe generar crear un nuevo gasto", async () => {
    const gastoMock = {
      save: jest.fn(),
    };

    (Gasto.create as jest.Mock).mockResolvedValue(gastoMock);

    const req = createRequest({
      method: "POST",
      url: "/api/presupuestos/:idPresupuesto/gastos",
      body: {
        nombre: "Prueba Gasto",
        cantidad: 100,
      },
      presupuesto: {
        id: 1,
      },
    });

    const res = createResponse();

    await GastoController.crear(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(201);
    expect(data).toEqual("Gasto creado correctamente");
    expect(gastoMock.save).toHaveBeenCalled();
    expect(gastoMock.save).toHaveBeenCalledTimes(1);
    expect(Gasto.create).toHaveBeenCalledWith(req.body);
  });

  it("Debe manejar el error al crear un nuevo gasto", async () => {
    const gastoMock = {
      save: jest.fn(),
    };

    (Gasto.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/presupuestos/:idPresupuesto/gastos",
      body: {
        nombre: "Prueba Gasto",
        cantidad: 100,
      },
      presupuesto: {
        id: 1,
      },
    });

    const res = createResponse();

    await GastoController.crear(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un error" });
    expect(gastoMock.save).not.toHaveBeenCalled();
    expect(Gasto.create).toHaveBeenCalledWith(req.body);
  });
});
