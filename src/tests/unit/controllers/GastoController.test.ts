import { createRequest, createResponse } from "node-mocks-http";
import Gasto from "../../../models/Gasto";
import { GastoController } from "../../../controllers/GastoController";
import { gastos } from "../../mocks/gastos";

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

describe("GastoController.obtenerPorId", () => {
  it("Debe devolver todos los gastos del presupuesto con id: 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/presupuestos/:idPresupuesto/gastos/:idGasto",
      gasto: gastos[0],
    });

    const res = createResponse();

    await GastoController.obtenerPorId(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toEqual(gastos[0]);
  });
});

describe("GastoController.editarPorId", () => {
  it("Debe manejar la actualizacion de un gasto y regresar un mensaje de exito", async () => {
    const gastoMock = {
      ...gastos[0],
      update: jest.fn(),
    };

    const req = createRequest({
      method: "PUT",
      url: "/api/presupuestos/:idPresupuesto/gastos/:idGasto",
      gasto: gastoMock,
      body: {
        nombre: "Gasto Actualizado",
        cantidad: 100,
      },
    });

    const res = createResponse();

    await GastoController.editarPorId(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toBe("Gasto actualizado correctamente");
    expect(gastoMock.update).toHaveBeenCalledWith(req.body);
    expect(gastoMock.update).toHaveBeenCalledTimes(1);
  });
});

describe("GastoController.eliminarPorId", () => {
  it("Debe manejar la eliminacion de un gasto y regresar un mensaje de exito", async () => {
    const gastoMock = {
      ...gastos[0],
      destroy: jest.fn(),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/presupuestos/:idPresupuesto/gastos/:idGasto",
      gasto: gastoMock,
    });

    const res = createResponse();

    await GastoController.eliminarPorId(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toBe("Gasto eliminado correctamente");
    expect(gastoMock.destroy).toHaveBeenCalled();
    expect(gastoMock.destroy).toHaveBeenCalledTimes(1);
  });
});
