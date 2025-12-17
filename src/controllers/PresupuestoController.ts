import { Request, Response } from "express";
import Presupuesto from "../models/Presupuesto";
import Gasto from "../models/Gasto";

export class PresupuestoController {
  static crear = async (req: Request, res: Response) => {
    try {
      const presupuesto = new Presupuesto(req.body);
      presupuesto.idUsuario = req.usuario.id;
      await presupuesto.save();
      res.status(201).json("Presupuesto creado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static obtener = async (req: Request, res: Response) => {
    try {
      const presupuestos = await Presupuesto.findAll({
        where: {
          idUsuario: req.usuario.id,
        },
        order: [["createdAt", "DESC"]],
      });
      res.json(presupuestos);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static obtenerPorId = async (req: Request, res: Response) => {
    const presupuesto = await Presupuesto.findByPk(req.presupuesto.id, {
      include: [Gasto],
    });
    res.json(presupuesto);
  };

  static editarPorId = async (req: Request, res: Response) => {
    await req.presupuesto.update(req.body);
    res.json("Presupuesto actualizado correctamente");
  };

  static eliminarPorId = async (req: Request, res: Response) => {
    await req.presupuesto.destroy();
    res.json("Presupuesto eliminado correctamente");
  };
}
