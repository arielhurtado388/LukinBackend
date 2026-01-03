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
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #1e1b4b; padding: 40px 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Lukin</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1e1b4b; font-size: 24px; font-weight: 600;">Confirma tu cuenta</h2>
                      <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                        Hola <strong style="color: #1e1b4b;">${
                          usuario.nombre
                        }</strong>, gracias por crear tu cuenta en Lukin. Para completar el registro, necesitas confirmar tu correo electrónico.
                      </p>
                      
                      <!-- Token Box -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 4px;">
                        <p style="margin: 0 0 8px; color: #78350f; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Tu código de confirmación</p>
                        <p style="margin: 0; color: #1e1b4b; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">${
                          usuario.token
                        }</p>
                      </div>
                      
                      <p style="margin: 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                        Haz clic en el botón de abajo para ir a la página de confirmación:
                      </p>
                      
                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                        <tr>
                          <td align="center">
                            <a href="${
                              process.env.FRONTEND_URL
                            }/auth/confirmar" style="display: inline-block; background-color: #f59e0b; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-weight: 600; font-size: 16px;">Confirmar cuenta</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 24px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        Si no creaste esta cuenta, puedes ignorar este mensaje.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; color: #64748b; font-size: 14px;">
                        &copy; ${new Date().getFullYear()} Lukin. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    // console.log("Mensaje enviado", correo.messageId);
  };

  static reestablecerPassword = async (usuario: CorreoType) => {
    const correo = await transport.sendMail({
      from: "Lukin <noreply@arielhurtado.online>",
      to: usuario.correo,
      subject: "Lukin - Reestablece tu contraseña",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #1e1b4b; padding: 40px 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Lukin</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #1e1b4b; font-size: 24px; font-weight: 600;">Reestablece tu contraseña</h2>
                      <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                        Hola <strong style="color: #1e1b4b;">${
                          usuario.nombre
                        }</strong>, hemos recibido una solicitud para reestablecer la contraseña de tu cuenta en Lukin.
                      </p>
                      
                      <!-- Token Box -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 4px;">
                        <p style="margin: 0 0 8px; color: #78350f; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Tu código de recuperación</p>
                        <p style="margin: 0; color: #1e1b4b; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">${
                          usuario.token
                        }</p>
                      </div>
                      
                      <p style="margin: 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                        Haz clic en el botón de abajo para ir a la página de recuperación:
                      </p>
                      
                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                        <tr>
                          <td align="center">
                            <a href="${
                              process.env.FRONTEND_URL
                            }/auth/reestablecer" style="display: inline-block; background-color: #f59e0b; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-weight: 600; font-size: 16px;">Reestablecer contraseña</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 24px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        Si no solicitaste este cambio, ignora este mensaje y tu contraseña permanecerá sin cambios.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; color: #64748b; font-size: 14px;">
                        &copy; ${new Date().getFullYear()} Lukin. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    // console.log("Mensaje enviado", correo.messageId);
  };
}
