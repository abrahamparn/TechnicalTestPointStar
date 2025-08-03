import nodemailer from "nodemailer";

export function makeMailerService({ env }) {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    service: "gmail",
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  // Verify Transporter
  transporter
    .verify()
    .then(() => {
      console.log("Mailer service is ready to send email");
    })
    .catch(console.error);

  async function sendEmail({ to, subject, text, html }) {
    const mailOption = {
      from: env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };

    // we send mail here
    const info = await transporter.sendMail(mailOption);
    console.log(`Message send ${info.messageId}`);
    return info;
  }

  return { sendEmail };
}
