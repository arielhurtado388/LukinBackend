import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Presupuesto from "../models/Presupuesto";

declare global {
  namespace Express {
    interface Request {
      presupuesto?: Presupuesto;
    }
  }
}

export const validarIdPresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("idPresupuesto")
    .isInt()
    .withMessage("El id no es válido")
    .bail()
    .custom((value) => value > 0)
    .withMessage("El id no es válido")
    .bail()
    .run(req);

  let errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  next();
};

export const validarExistenciaPresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idPresupuesto } = req.params;
    const presupuesto = await Presupuesto.findByPk(idPresupuesto);
    if (!presupuesto) {
      const error = new Error("El presupuesto no existe");
      return res.status(404).json({ error: error.message });
    }
    req.presupuesto = presupuesto;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const validarEntradaPresupuesto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("nombre")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres")
    .run(req);
  await body("cantidad")
    .isNumeric()
    .withMessage("La cantidad no es válida")
    .custom((value) => value > 0)
    .withMessage("La cantidad debe ser mayor a 0")
    .run(req);

  next();
};

export function verificarAcceso(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.presupuesto.idUsuario !== req.usuario.id) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ error: error.message });
  }
  next();
}
