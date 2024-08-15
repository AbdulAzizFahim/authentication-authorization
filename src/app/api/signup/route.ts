import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { isValidEmail } from "@/helpers/loginValidator";
import { checkUserLoginCredentials } from "@/helpers/loginValidator";
import UserDb from "@/dbModels/User";
import { generateHashToken } from "@/helpers/hashHelper";
import EmailData from "@/models/EmailData";
import sendEmail from "@/helpers/emailSender";
import connectToMongoDb from "@/helpers/dbConnect";
import moment from "moment";

export async function POST(req: NextRequest) {
  const signupData: User = await req.json();
  const { email, password, username } = signupData;

  if (!email || !password || !username) {
    return NextResponse.json({ error: "Email, username and password is mandatory!" });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json("Invalid email format!");
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
    const savedUser = await newUser.save();

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

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
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

    return NextResponse.json("Verification email sent!");
  } else {
    return NextResponse.json({ error: "User is already registered!" });
  }
}
