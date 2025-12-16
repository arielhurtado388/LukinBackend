import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleErroresEntrada } from "../middleware/validacion";
import { limiter } from "../config/limiter";

const router = Router();

router.use(limiter);

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

router.post(
  "/confirmar-cuenta",
  body("token")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código no es válido"),
  handleErroresEntrada,
  AuthController.confirmarCuenta
);

router.post(
  "/iniciar-sesion",
  body("correo").isEmail().withMessage("El correo no es válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleErroresEntrada,
  AuthController.iniciarSesion
);

router.post(
  "/reestablecer-password",
  body("correo").isEmail().withMessage("El correo no es válido"),
  handleErroresEntrada,
  AuthController.reestablecerPassword
);

router.post(
  "/validar-token",
  body("token")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código no es válido"),
  handleErroresEntrada,
  AuthController.validarToken
);

router.post(
  "/resetear-password/:token",
  param("token")
    .isLength({ min: 6, max: 6 })
    .withMessage("El código no es válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  handleErroresEntrada,
  AuthController.resetearPasswordConToken
);

export default router;
