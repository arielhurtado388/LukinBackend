import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Gasto from "../models/Gasto";

declare global {
  namespace Express {
    interface Request {
      gasto?: Gasto;
    }
  }
}

export const validarIdGasto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("idGasto")
    .isInt()
    .withMessage("El id no es válido")
    .custom((value) => value > 0)
    .withMessage("El id no es válido")
    .run(req);

  let errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  next();
};

export const validarExistenciaGasto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idGasto } = req.params;
    const gasto = await Gasto.findByPk(idGasto);
    if (!gasto) {
      const error = new Error("El gasto no existe");
      return res.status(404).json({ error: error.message });
    }
    req.gasto = gasto;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const validarEntradaGasto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("nombre")
    .isLength({ min: 3, max: 60 })
    .withMessage("El nombre debe tener entre 3 y 60 caracteres")
    .run(req);
  await body("cantidad")
    .isNumeric()
    .withMessage("La cantidad no es válida")
    .custom((value) => value > 0)
    .withMessage("La cantidad debe ser mayor a 0")
    .run(req);

  next();
};
