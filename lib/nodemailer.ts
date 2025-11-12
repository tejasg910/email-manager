import nodemailer, { createTransport } from "nodemailer"

export const createTransporter = (smtpUser: string, smtpPass: string) => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT!),
         tls: {
    rejectUnauthorized: false
}, 
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
};




export async function verifySmtpCredentials(email: string, password: string): Promise<boolean> {
  const transporter = createTransport({
      host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT!),
    secure: false,
    tls: {
    rejectUnauthorized: false
}, 
    auth: {
      user: email,
      pass: password,
    },
   
  });

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP Verification Error:', error);
    return false;
  } finally {
    transporter.close();
  }
}
