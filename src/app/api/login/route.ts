import { ILoginData } from "@/models/Authentication";
import UserLogin from "@/models/UserLoginInfo";
import { sendVerificationEmailAndUpdateDb } from "@/utility/backend/EmailService";
import { checkUserLoginCredentials } from "@/utility/backend/LoginValidator";
import { setAccessTokenToCookies } from "@/utility/backend/TokenService";
import isValidEmail from "@/utility/shared/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userData: ILoginData = await req.json();
    const { Email, Password } = userData;

    if (!Email || !Password) {
      return NextResponse.json({ isVerified: false, message: "Username and password missing!" });
    }

    if (!isValidEmail(Email)) {
      return NextResponse.json({ isVerified: false, message: "Please use a valid email address!" });
    }

    const userLogin: UserLogin = await checkUserLoginCredentials(userData);
    if (userLogin.isEmailVerified) {
      const response = NextResponse.json({ isVerified: true, message: "User Authenticated" });
      setAccessTokenToCookies(Email, response);
      return response;
    }
    else if (!userLogin.isPasswordMatched) {
      return NextResponse.json({ isVerified: false, message: "Invalid user credentials!" });
    }
    else {
      await sendVerificationEmailAndUpdateDb(Email, userLogin.verificationToken);
      NextResponse.json({ isVerified: true, message: "A verification email has been sent" });
    }
  }
  catch (error) {
    return NextResponse.json({ isVerified: false, message: "Can not validate user!" });
  }
}
