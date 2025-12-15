import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import { hashPassword } from "../helpers/auth";
import { generarToken } from "../helpers/token";
import { AuthCorreo } from "../correos/AuthCorreo";

export class AuthController {
  static crearCuenta = async (req: Request, res: Response) => {
    const { correo, password } = req.body;
    const existeUsuario = await Usuario.findOne({
      where: {
        correo,
      },
    });
    if (existeUsuario) {
      const error = new Error("Ya existe un usuario con ese correo");
      return res.status(409).json({ error: error.message });
    }

    try {
      const usuario = new Usuario(req.body);
      usuario.password = await hashPassword(password);
      usuario.token = generarToken();
      await usuario.save();

      await AuthCorreo.enviarConfirmacion({
        nombre: usuario.nombre,
        correo: usuario.correo,
        token: usuario.token,
      });

      res.json("Cuenta creada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
