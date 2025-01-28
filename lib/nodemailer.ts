import nodemailer, { createTransport } from "nodemailer"

export const createTransporter = (smtpUser: string, smtpPass: string) => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT!),
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
};




export async function verifySmtpCredentials(email: string, password: string): Promise<boolean> {
  const transporter = createTransport({
    host: 'smtp.gmail.com', // or your SMTP host
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: password,
    },
    connectionTimeout: 5000, // 5 seconds connection timeout
    socketTimeout: 5000,     // 5 seconds socket timeout
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
