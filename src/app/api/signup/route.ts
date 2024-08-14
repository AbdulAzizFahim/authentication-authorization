import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { isValidEmail } from "@/helpers/loginValidator";
import { checkUserLoginCredentials } from "@/helpers/loginValidator";
import UserDb from "@/dbModels/User";
import { generateHash } from "@/helpers/hashHelper";
import EmailData from "@/models/EmailData";
import sendEmail from "@/helpers/emailSender";
import connectToMongoDb from "@/helpers/dbConnect";

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
    const hashedPassword = await generateHash(password);
    const newUser = await new UserDb({
      email: email,
      password: hashedPassword,
      username: username,
    });
    const savedUser = await newUser.save();

    const token = generateHash(email);
    const emailData: EmailData = {
      to: email,
      subject: "Signup email verification",
      html: `"Click the following link for email verfication."
      <br> 
        <a href="http://localhost:3000/verifyemail?token=${token}">
            Click Me 
        </a>
        `,
    };

    await sendEmail(emailData);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } else if (!userInfo.isEmailVerified) {
    const token = generateHash(email);
    const emailData: EmailData = {
      to: email,
      subject: "Signup email verification",
      text: "Click the following link for email verfication.",
      html: `Click the following link for email verfication.
      <br> 
        <a href="http://localhost:3000/verifyemail?token=${token}">
            Click Me 
        </a>
        `,
    };
    await sendEmail(emailData);

    return NextResponse.json("Verification email sent!");
  } else {
    return NextResponse.json({ error: "User is already registered!" });
  }
}
