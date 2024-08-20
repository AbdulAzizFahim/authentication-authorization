import nodemailer from "nodemailer";
import EmailData from "@/models/EmailData";

const sendEmail = async (data: EmailData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_ADDRESS,
      subject: data.subject,
      to: data.to,
      text: data.text,
      html: data.html,
    });

    console.log(`Sent email to ${data.to}`);

    return info;
  } catch (error) {
    console.log("Can not send email!");
    return null;
  }
};

export default sendEmail;
