import { Request, Response } from "express";
import Gasto from "../models/Gasto";

export class GastoController {
  static crear = async (req: Request, res: Response) => {
    try {
      const gasto = new Gasto(req.body);
      gasto.idPresupuesto = req.presupuesto.id;
      await gasto.save();
      res.status(201).json("Gasto creado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static obtenerPorId = async (req: Request, res: Response) => {
    res.json(req.gasto);
  };

  static editarPorId = async (req: Request, res: Response) => {
    await req.gasto.update(req.body);
    res.json("Gasto actualizado correctamente");
  };

  static eliminarPorId = async (req: Request, res: Response) => {
    await req.gasto.destroy();
    res.json("Gasto eliminado correctamente");
  };
}
