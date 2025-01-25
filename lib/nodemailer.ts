import nodemailer from "nodemailer"

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



export async function verifySmtpCredentials(smtpUser: string, smtpPass: string) {
    try {
        const transporter = createTransporter(smtpUser, smtpPass);

        await transporter.verify();
        console.log('SMTP credentials are valid');
        return true;
    } catch (error) {
        console.error('SMTP verification failed:', error);
        return false;
    }
}

