interface EmailData {
  to: string;
  subject: string | undefined;
  text?: string | undefined;
  html: string | undefined;
}

export default EmailData;
