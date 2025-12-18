import { createRequest, createResponse } from "node-mocks-http";
import {
  validarExistenciaPresupuesto,
  verificarAcceso,
} from "../../../middleware/presupuesto";
import Presupuesto from "../../../models/Presupuesto";
import { presupuestos } from "../../mocks/presupuestos";

jest.mock("../../../models/Presupuesto", () => ({
  findByPk: jest.fn(),
}));

describe("presupuesto - validarExistenciaPresupuesto", () => {
  it("Debe manejar un presupuesto que no existe", async () => {
    (Presupuesto.findByPk as jest.Mock).mockResolvedValue(null);

    const req = createRequest({
      params: {
        idPresupuesto: 1,
      },
    });

    const res = createResponse();
    const next = jest.fn();

    await validarExistenciaPresupuesto(req, res, next);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(404);
    expect(data).toEqual({ error: "El presupuesto no existe" });
    expect(next).not.toHaveBeenCalled();
  });

  it("Debe verificar que un presupuesto exista", async () => {
    (Presupuesto.findByPk as jest.Mock).mockResolvedValue(presupuestos[0]);

    const req = createRequest({
      params: {
        idPresupuesto: 1,
      },
    });

    const res = createResponse();
    const next = jest.fn();

    await validarExistenciaPresupuesto(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.presupuesto).toEqual(presupuestos[0]);
  });

  it("Debe manejar el error al validar si existe un presupuesto", async () => {
    (Presupuesto.findByPk as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      params: {
        idPresupuesto: 1,
      },
    });

    const res = createResponse();
    const next = jest.fn();

    await validarExistenciaPresupuesto(req, res, next);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un error" });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("presupuesto - verificarAcceso", () => {
  it("Debe permitir el acceso si el usuario es el propietario del presupuesto", () => {
    const req = createRequest({
      presupuesto: presupuestos[0],
      usuario: { id: 1 },
    });

    const res = createResponse();
    const next = jest.fn();

    verificarAcceso(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("Debe restringir el acceso si el usuario no es el propietario del presupuesto", () => {
    const req = createRequest({
      presupuesto: presupuestos[0],
      usuario: { id: 2 },
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
