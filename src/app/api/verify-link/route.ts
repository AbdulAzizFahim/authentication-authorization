import UserDb from "@/dbModels/User";
import { verificationType } from "@/models/Authentication";
import {
  dbUpdateEmailVerifyToken,
  isResetPasswordTokenExists,
  setUserVerified
} from "@/utility/backend/DbService";
import { createAndSendVerifyEmailMail } from "@/utility/backend/EmailService";
import { generateHash } from "@/utility/backend/HashService";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token: string = url.searchParams.get("token") ?? "";
  const type: string = url.searchParams.get("type") ?? "";
  if (!token || !type) {
    return NextResponse.json({ isVerified: false, message: "Invalid link" });
  }

  switch (type) {
    case verificationType.verifyEmail:
      const verifyEmailResult: [boolean, string] = await verifyEmail(token);
      return NextResponse.json({ isVerified: verifyEmailResult[0], message: verifyEmailResult[1] });
    case verificationType.forgetPassword:
      const verifyForgetPassowordResult: [boolean, string] = await verifyForgetPassoword(token);
      return NextResponse.json({ isVerified: verifyForgetPassowordResult[0], message: verifyForgetPassowordResult[1] });
    default:
      return NextResponse.json({ isVerified: false, message: "Invalid link" });
  }
}

const verifyEmail = async (currentToken: string): Promise<[boolean, string]> => {
  const user = await UserDb.findOne({ email_verify_token: currentToken });
  if (!user) {
    return [false, "Invalid link"];
  }
  else if (user.is_verified) {
    return [false, "Email already verified!"];
  }
  const expiryDate: Date = user.token_expiry_date;
  const todaysDate: Date = moment.utc().toDate();
  const email: string = user.email;
  if (expiryDate < todaysDate) {
    const newToken: string = await generateHash(email);
    const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime = moment().utc().add(expiryDuration, "hours").toDate();
    await Promise.all([
      dbUpdateEmailVerifyToken(email, newToken, expiryDateTime),
      createAndSendVerifyEmailMail(email, newToken)
    ]);
    return [false, "Email verification link expired. Sent a new verification email."];
  }

  await setUserVerified(user);
  return [true, "Verification successful, redirecting to login page..."];
};

const verifyForgetPassoword = async (token: string): Promise<[boolean, string]> => {

  const user = await isResetPasswordTokenExists(token);
  if (!user) {
    return [false, "Invalid link"];
  }
  const expiryDate: Date = user.token_expiry_date;
  const todaysDate: Date = moment.utc().toDate();
  if (expiryDate < todaysDate) {
    return [false, "Reset password link expired"];
  }

  return [true, "Verification successful"];
};
