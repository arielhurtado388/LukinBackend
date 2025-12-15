import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleErroresEntrada } from "../middleware/validacion";

const router = Router();

router.post(
  "/crear-cuenta",
  body("nombre")
    .isLength({ min: 3, max: 60 })
    .withMessage("El nombre debe tener entre 3 y 60 caracteres"),
  body("correo").isEmail().withMessage("El correo no es válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  handleErroresEntrada,
  AuthController.crearCuenta
);

export default router;
