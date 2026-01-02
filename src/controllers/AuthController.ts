import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import { hashPassword, verificarPassword } from "../helpers/auth";
import { generarToken } from "../helpers/token";
import { AuthCorreo } from "../correos/AuthCorreo";
import { generarJWT } from "../helpers/jwt";

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
      const usuario = await Usuario.create(req.body);
      usuario.password = await hashPassword(password);
      const token = generarToken();
      usuario.token = token;
      if (process.env.NODE_ENV !== "production") {
        globalThis.tokenConfirmacionLukin = token;
      }
      await usuario.save();

      // await AuthCorreo.enviarConfirmacion({
      //   nombre: usuario.nombre,
      //   correo: usuario.correo,
      //   token: usuario.token,
      // });

      res.status(201).json("Cuenta creada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmarCuenta = async (req: Request, res: Response) => {
    const { token } = req.body;

    const usuario = await Usuario.findOne({
      where: { token },
    });

    if (!usuario) {
      const error = new Error("El código no es válido");
      return res.status(401).json({ error: error.message });
    }

    usuario.confirmado = true;
    usuario.token = null;
    await usuario.save();

    res.json("Cuenta confirmada correctamente");
  };

  static iniciarSesion = async (req: Request, res: Response) => {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        correo,
      },
    });

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }

    if (!usuario.confirmado) {
      const error = new Error("Cuenta no confirmada");
      return res.status(403).json({ error: error.message });
    }

    const esPasswordCorrecto = await verificarPassword(
      password,
      usuario.password
    );

    if (!esPasswordCorrecto) {
      const error = new Error("Contraseña incorrecta");
      return res.status(401).json({ error: error.message });
    }

    const token = generarJWT(usuario.id);
    res.json(token);
  };

  static reestablecerPassword = async (req: Request, res: Response) => {
    const { correo } = req.body;

    const usuario = await Usuario.findOne({
      where: {
        correo,
      },
    });

    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }

    usuario.token = generarToken();
    await usuario.save();

    await AuthCorreo.reestablecerPassword({
      nombre: usuario.nombre,
      correo: usuario.correo,
      token: usuario.token,
    });

    res.json("Revisa tu correo y sigue las instrucciones");
  };

  static validarToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    const existeToken = await Usuario.findOne({
      where: { token },
    });

    if (!existeToken) {
      const error = new Error("El código no es válido");
      return res.status(404).json({ error: error.message });
    }

    res.json("Código válido, asigna una nueva contraseña");
  };

  static resetearPasswordConToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({
      where: { token },
    });

    if (!usuario) {
      const error = new Error("El código no es válido");
      return res.status(404).json({ error: error.message });
    }

    usuario.password = await hashPassword(password);
    usuario.token = null;
    await usuario.save();

    res.json("Contraseña reestablecida correctamente");
  };

  static usuario = async (req: Request, res: Response) => {
    res.json(req.usuario);
  };

  static actualizarPassword = async (req: Request, res: Response) => {
    const { password, nuevo_password } = req.body;

    const usuario = await Usuario.findByPk(req.usuario.id);

    const esPasswordCorrecto = await verificarPassword(
      password,
      usuario.password
    );

    if (!esPasswordCorrecto) {
      const error = new Error("La contraseña actual es incorrecta");
      return res.status(401).json({ error: error.message });
    }

    usuario.password = await hashPassword(nuevo_password);
    await usuario.save();

    res.json("Contraseña actualizada correctamente");
  };

  static verificarPassword = async (req: Request, res: Response) => {
    const { password } = req.body;

    const usuario = await Usuario.findByPk(req.usuario.id);

    const esPasswordCorrecto = await verificarPassword(
      password,
      usuario.password
    );

    if (!esPasswordCorrecto) {
      const error = new Error("La contraseña actual es incorrecta");
      return res.status(401).json({ error: error.message });
    }

    res.json("Contraseña correcta");
  };

  static actualizarPerfil = async (req: Request, res: Response) => {
    const { nombre, correo } = req.body;

    const existeUsuario = await Usuario.findOne({
      where: {
        correo,
      },
    });

    if (existeUsuario && existeUsuario.id !== req.usuario.id) {
      const error = new Error("El correo ya está registrado");
      return res.status(409).json({ error: error.message });
    }

    req.usuario.nombre = nombre;
    req.usuario.correo = correo;
    try {
      await req.usuario.save();
      res.json("Perfil actualizado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
