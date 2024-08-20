import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { isValidEmail } from "@/utility/loginValidator";
import { checkUserLoginCredentials } from "@/utility/loginValidator";
import UserDb from "@/dbModels/User";
import { generateHashToken } from "@/utility/hashHelper";
import EmailData from "@/models/EmailData";
import sendEmail from "@/utility/emailSender";
import connectToMongoDb from "@/utility/dbConnect";
import moment from "moment";

export async function POST(req: NextRequest) {
  const signupData: User = await req.json();
  const { email, password, username } = signupData;

  if (!email || !password || !username) {
    return NextResponse.json(
      { isAuthenticated: false, message: "Email, username and password is mandatory!" },
      { status: 200 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { isAuthenticated: false, message: "Invalid email format!" },
      { status: 200 }
    );
  }

  connectToMongoDb();
  const userInfo = await checkUserLoginCredentials(signupData);
  if (!userInfo.isUserFound) {
    const hashedPassword = await generateHashToken(password);
    const newUser = await new UserDb({
      email: email,
      password: hashedPassword,
      username: username,
    });
    await newUser.save();

    const token = await generateHashToken(email);
    const emailData: EmailData = {
      to: email,
      subject: "Signup email verification",
      html: `"Click the following link for email verfication."
      <br> 
        <a href="http://localhost:3000/verify-link-page?token=${token}&type=verifyEmail">
            Click Me 
        </a>
        `,
    };

    await sendEmail(emailData);
    const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime = moment().utc().add(expiryDuration, "hours").toDate();
    await UserDb.updateOne(
      { email: email },
      { $set: { email_verify_token: token, token_expiry_date: expiryDateTime } }
    );

    return NextResponse.json(
      { isAuthenticated: true, message: "Signup completed" },
      { status: 200 }
    );
  } else if (!userInfo.isEmailVerified) {
    const token = await generateHashToken(email);
    const emailData: EmailData = {
      to: email,
      subject: "Signup email verification",
      text: "Click the following link for email verfication.",
      html: `Click the following link for email verfication.
      <br> 
        <a href="http://localhost:3000/verify-link-page?token=${token}&type=verifyEmail">
            Click Me 
        </a>
        `,
    };
    await sendEmail(emailData);

    const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime = moment().utc().add(expiryDuration, "hours").toDate();
    await UserDb.updateOne(
      { email: email },
      { $set: { email_verify_token: token, token_expiry_date: expiryDateTime } }
    );

    return NextResponse.json(
      { isAuthenticated: true, message: "Verification email sent! Please check your email" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { isAuthenticated: false, message: "User already registered!" },
      { status: 200 }
    );
  }
}
