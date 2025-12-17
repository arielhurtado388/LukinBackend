import { Router } from "express";
import { PresupuestoController } from "../controllers/PresupuestoController";
import { handleErroresEntrada } from "../middleware/validacion";
import {
  validarEntradaPresupuesto,
  validarExistenciaPresupuesto,
  validarIdPresupuesto,
  verificarAcceso,
} from "../middleware/presupuesto";
import { GastoController } from "../controllers/GastoController";
import {
  validarEntradaGasto,
  validarExistenciaGasto,
  validarIdGasto,
} from "../middleware/gasto";
import { autenticar } from "../middleware/auth";

const router = Router();

router.use(autenticar);

router.param("idPresupuesto", validarIdPresupuesto);
router.param("idPresupuesto", validarExistenciaPresupuesto);
router.param("idPresupuesto", verificarAcceso);

router.param("idGasto", validarIdGasto);
router.param("idGasto", validarExistenciaGasto);

// Rutas para presupuestos
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

// Rutas para gastos
router.post(
  "/:idPresupuesto/gastos",
  validarEntradaGasto,
  handleErroresEntrada,
  GastoController.crear
);
router.get("/:idPresupuesto/gastos/:idGasto", GastoController.obtenerPorId);
router.put(
  "/:idPresupuesto/gastos/:idGasto",
  validarEntradaGasto,
  handleErroresEntrada,
  GastoController.editarPorId
);
router.delete("/:idPresupuesto/gastos/:idGasto", GastoController.eliminarPorId);

export default router;
