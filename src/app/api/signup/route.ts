import { ISignupData } from "@/models/Authentication";
import { createNewUser } from "@/utility/backend/DbService";
import { sendVerificationEmailAndUpdateDb } from "@/utility/backend/EmailService";
import { createAndSendVerifyEmailMail } from "@/utility/backend/EmailService";
import { generateHash } from "@/utility/backend/HashService";
import { checkUserLoginCredentials } from "@/utility/backend/LoginValidator";
import isValidEmail from "@/utility/shared/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const signupData: ISignupData = await req.json();
  const { Email, Password, Username, ConfirmPassword } = signupData;

  if (!Email || !Password || !Username) {
    return NextResponse.json({
      isAuthenticated: false,
      message: "Email, username and password is mandatory!",
    });
  }

  if (Password !== ConfirmPassword) {
    return NextResponse.json({
      isAuthenticated: false,
      message: "Password and confirm password has to be exact match",
    });
  }

  if (!isValidEmail(Email)) {
    return NextResponse.json({ isAuthenticated: false, message: "Invalid email format!" });
  }
  try {
    const userInfo = await checkUserLoginCredentials(signupData);
    if (!userInfo.isUserFound) {
      const token: string = await generateHash(Email);
      await createNewUser(signupData, token);
      await createAndSendVerifyEmailMail(Email, token);
      return NextResponse.json({ isAuthenticated: true, message: "Signup completed" });
    }
    else if (!userInfo.isEmailVerified) {
      await sendVerificationEmailAndUpdateDb(Email);
      return NextResponse.json({
        isAuthenticated: true,
        message: "Verification email sent! Please check your email",
      });
    }
    else {
      return NextResponse.json({ isAuthenticated: false, message: "User already registered!" });
    }
  }
  catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
      message: "Signup failed, please try again later.",
    });
  }
}
