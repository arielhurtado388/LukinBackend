import { Router } from "express";
import { body, param } from "express-validator";
import { PresupuestoController } from "../controllers/PresupuestoController";
import { handleErroresEntrada } from "../middleware/validacion";
import {
  validarEntradaPresupuesto,
  validarExistenciaPresupuesto,
  validarIdPresupuesto,
} from "../middleware/presupuesto";

const router = Router();

router.param("idPresupuesto", validarIdPresupuesto);
router.param("idPresupuesto", validarExistenciaPresupuesto);

router.post(
  "/",
  validarEntradaPresupuesto,
  handleErroresEntrada,
  PresupuestoController.crear
);
router.get("/", PresupuestoController.obtener);

router.get("/:idPresupuesto", PresupuestoController.obtenerPorId);

router.put(
  "/:idPresupuesto",
  validarEntradaPresupuesto,
  handleErroresEntrada,
  PresupuestoController.editarPorId
);

router.delete("/:idPresupuesto", PresupuestoController.eliminarPorId);

export default router;
