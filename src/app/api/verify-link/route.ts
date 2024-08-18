import UserDb from "@/dbModels/User";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import { generateHashToken } from "@/helpers/hashHelper";
import EmailData from "@/models/EmailData";
import sendEmail from "@/helpers/emailSender";
import connectToMongoDb from "@/helpers/dbConnect";

enum verificationType {
  verifyEmail = "verifyEmail",
  forgetPassword = "forgetPassword",
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token: string = url.searchParams.get("token") ?? "";
  const type: string = url.searchParams.get("type") ?? "";
  if (!token || !type) {
    return NextResponse.json(
      {
        isVerified: false,
        message: "Invalid link",
      },
      { status: 500 }
    );
  }

  switch (type) {
    case verificationType.verifyEmail:
      const verifyEmailResult: [boolean, string] = await verifyEmail(token);
      return NextResponse.json(
        {
          isVerified: verifyEmailResult[0],
          message: verifyEmailResult[1],
        },
        { status: 200 }
      );
    case verificationType.forgetPassword:
      const verifyForgetPassowordResult: [boolean, string] = await verifyForgetPassoword(token);
      return NextResponse.json(
        {
          isVerified: verifyForgetPassowordResult[0],
          message: verifyForgetPassowordResult[1],
        },
        { status: 200 }
      );
    default:
      return NextResponse.json(
        {
          isVerified: false,
          message: "Invalid link",
        },
        { status: 500 }
      );
  }
}

const verifyEmail = async (token: string): Promise<[boolean, string]> => {
  await connectToMongoDb();
  const user = await UserDb.findOne({ email_verify_token: token });
  if (!user) {
    return [false, "Invalid link"];
  } else if (user.is_verified) {
    return [false, "Email already verified!"];
  }
  const expiryDate: Date = user.token_expiry_date;
  const todaysDate: Date = moment.utc().toDate();
  if (expiryDate < todaysDate) {
    const newToken: string = await generateHashToken(user.email);
    const emailData: EmailData = {
      to: user.email,
      subject: "Email verification",
      text: "Click the following link for email verfication.",
      html: `Click the following link for email verfication.
              <br> 
              <a href="http://localhost:3000/verify-link-page?token=${newToken}"> 
                Click Me 
              </a>
              `,
    };

    const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime = moment().utc().add(expiryDuration, "hours").toDate();
    await UserDb.updateOne(
      { email: user.email },
      { $set: { email_verify_token: token, token_expiry_date: expiryDateTime } }
    );

    await sendEmail(emailData);

    return [false, "Email verification link expired. Sent new verification email."];
  }

  user.is_verified = true;
  user.email_verify_token = null;
  user.token_expiry_date = null;
  await user.save();

  return [true, "Verification successful!"];
};

const verifyForgetPassoword = async (token: string): Promise<[boolean, string]> => {
  connectToMongoDb();
  const user = await UserDb.findOne({ reset_password_token: token });
  if (!user) {
    return [false, "Invalid link"];
  }
  const expiryDate: Date = user.token_expiry_date;
  const todaysDate: Date = moment.utc().toDate();
  if (expiryDate < todaysDate) {
    return [false, "Reset password link expired"];
  }

  user.is_verified = true;
  user.token_expiry_date = null;
  user.reset_password_token = null;
  await user.save();

  return [true, "Verification successful!"];
};
