import { ISignupData } from "@/models/Authentication";
import { createNewUser, isUserExists } from "@/utility/backend/DbService";
import { sendVerificationEmailAndUpdateDb } from "@/utility/backend/EmailService";
import { createAndSendVerifyEmailMail } from "@/utility/backend/EmailService";
import { comparePassword, generateHash } from "@/utility/backend/HashService";
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
    const userInfo = await isUserExists(signupData.Email);
    if (!userInfo) {
      const token: string = await generateHash(Email);
      await createNewUser(signupData, token);
      await createAndSendVerifyEmailMail(Email, token);
      return NextResponse.json({ isAuthenticated: true, message: "Signup completed" });
    }
    const isPasswordMatched = await comparePassword(signupData.Password, userInfo.password);
    if (isPasswordMatched && !userInfo.isEmailVerified) {
      await sendVerificationEmailAndUpdateDb(Email);
      return NextResponse.json({
        isAuthenticated: true,
        message: "Verification email sent! Please check your email",
      });
    }

    return NextResponse.json({ isAuthenticated: false, message: "User already registered!" });
  }
  catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
      message: "Signup failed, please try again later.",
    });
  }
}
