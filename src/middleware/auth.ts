import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario;
    }
  }
}

export const autenticar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No autorizado");
    return res.status(401).json({ error: error.message });
  }
  const [, token] = bearer.split(" ");
  if (!token) {
    const error = new Error("El código no es válido");
    return res.status(401).json({ error: error.message });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "object" && decoded.id) {
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: ["id", "nombre", "correo"],
      });
      req.usuario = usuario;
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "El código no es válido" });
  }
};
