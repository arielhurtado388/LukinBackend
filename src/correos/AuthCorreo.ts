import { transport } from "../config/nodemailer";

type CorreoType = {
  nombre: string;
  correo: string;
  token: string;
};

export class AuthCorreo {
  static enviarConfirmacion = async (usuario: CorreoType) => {
    const correo = await transport.sendMail({
      from: "Lukin <noreply@arielhurtado.online>",
      to: usuario.correo,
      subject: "Lukin - Confirma tu cuenta",
      html: `
        <p>Hola ${usuario.nombre}, has creado tu cuenta en Lukin y debes confirmarla.</p>
        <p>Visita el siguiente enlace: </p>
        <a href="#">Confirmar cuenta</a>
        <p>e ingresa el código: <b>${usuario.token}</b></p>
      `,
    });
    console.log("Mensaje enviado", correo.messageId);
  };
}
