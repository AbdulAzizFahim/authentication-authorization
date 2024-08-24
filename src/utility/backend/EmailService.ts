import EmailData from '@/models/EmailData';
import moment from 'moment';
import nodemailer from 'nodemailer';
import isValidEmail from '../shared/validators';
import { dbUpdateEmailVerifyToken } from './DbService';
import { generateHash } from './HashService';

const sendEmail = async (data: EmailData): Promise<boolean> => {
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

    await transporter.sendMail({
      from: process.env.MAIL_ADDRESS,
      subject: data.subject,
      to: data.to,
      text: data.text,
      html: data.html,
    });
    return true;
  }
  catch (error) {
    throw new Error('Can not send email');
  }
};

const sendVerificationEmailAndUpdateDb = async (email: string, token?: string | null): Promise<boolean> => {
  try {
    if (!email || !isValidEmail(email)) {
      throw new Error('Invalid email address');
    }

    token = token ?? (await generateHash(email));
    const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime = moment().utc().add(expiryDuration, 'hours').toDate();
    await dbUpdateEmailVerifyToken(email, token, expiryDateTime);
    await createAndSendVerifyEmailMail(email, token);
    return true;
  }
  catch (error) {
    throw new Error('Can not send verification email');
  }
};

const createAndSendVerifyEmailMail = async (email: string, token: string) => {
  if (!email || !token || !isValidEmail(email)) {
    throw new Error('Incorect parameters!');
  }
  try {
    const domain: string = process.env.DOMAIN!;
    const emailData: EmailData = {
      to: email,
      subject: 'Signup email verification',
      html: `"Click the following link for email verfication."
      <br> 
        <a href="${domain}/verify-link-page?token=${token}&type=verifyEmail">
            Click Me 
        </a>
        `,
    };
    await sendEmail(emailData);
  }
  catch (error) {
    throw new Error('Can not send email verification mail');
  }
};

const createAndSendResetPasswordMail = async (email: string, token: string): Promise<boolean> => {
  if (!email || !token || !isValidEmail(email)) {
    throw new Error('Incorect parameters!');
  }
  try {
    const domain: string = process.env.DOMAIN!;
    const emailData: EmailData = {
      to: email,
      subject: "Reset account password",
      html: `"Click the following link to reset your password."
    <br> 
    <a href="${domain}/verify-link-page?token=${token}&type=forgetPassword">
        Click Me 
    </a>
    `,
    };
    await sendEmail(emailData);
    return true;
  }
  catch (error) {
    throw new Error('Can not send reset password mail');
  }
}

export { sendEmail, sendVerificationEmailAndUpdateDb, createAndSendVerifyEmailMail, createAndSendResetPasswordMail };
