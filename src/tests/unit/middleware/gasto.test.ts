import { createRequest, createResponse } from "node-mocks-http";
import { validarExistenciaGasto } from "../../../middleware/gasto";
import { gastos } from "../../mocks/gastos";
import Gasto from "../../../models/Gasto";
import { verificarAcceso } from "../../../middleware/presupuesto";
import { presupuestos } from "../../mocks/presupuestos";

jest.mock("../../../models/Gasto", () => ({
  findByPk: jest.fn(),
}));

describe("gasto - validarExistenciaGasto", () => {
  beforeEach(() => {
    (Gasto.findByPk as jest.Mock).mockImplementation((idGasto) => {
      const gasto = gastos.filter((g) => g.id === idGasto)[0] ?? null;
      return Promise.resolve(gasto);
    });
  });

  it("Debe manejar un gasto que no existe", async () => {
    const req = createRequest({
      params: { idGasto: 120 },
    });

    const res = createResponse();
    const next = jest.fn();
    await validarExistenciaGasto(req, res, next);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data).toEqual({ error: "El gasto no existe" });
    expect(next).not.toHaveBeenCalled();
  });

  it("Debe manejar un gasto que existe e ir al siguiente middleware", async () => {
    const req = createRequest({
      params: { idGasto: 1 },
    });

    const res = createResponse();
    const next = jest.fn();
    await validarExistenciaGasto(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.gasto).toEqual(gastos[0]);
  });

  it("Debe manejar el error al validar si existe un gasto", async () => {
    (Gasto.findByPk as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      params: { idGasto: 1 },
    });

    const res = createResponse();
    const next = jest.fn();
    await validarExistenciaGasto(req, res, next);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un error" });
    expect(next).not.toHaveBeenCalled();
  });

  it("Debe manejar usuarios no autorizados", () => {
    const req = createRequest({
      method: "POST",
      url: "/api/presupuestos/:idPresupuesto/gastos",
      presupuesto: presupuestos[0],
      usuario: { id: 20 },
      body: { nombre: "Prueba Gasto", cantidad: 120 },
    });

    const res = createResponse();
    const next = jest.fn();

    verificarAcceso(req, res, next);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(401);
    expect(data).toEqual({ error: "Acción no válida" });
    expect(next).not.toHaveBeenCalled();
  });
});
