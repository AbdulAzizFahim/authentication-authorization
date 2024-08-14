import { NextRequest, NextResponse } from "next/server";
import { generateHash } from "@/helpers/hashHelper";
import { isValidEmail, checkUserLoginCredentials } from "@/helpers/loginValidator";
import sendEmail from "@/helpers/emailSender";
import connectToMongoDb from "@/helpers/dbConnect";
import User from "@/models/User";
import userDb from "@/dbModels/User";
import EmailData from "@/models/EmailData";
import UserLogin from "@/models/UserLoginInfo";

export async function POST(req: NextRequest) {
  try {
    const userData: User = await req.json();
    const { email, password } = userData;

    if (!email || !password) {
      return NextResponse.json({
        error: "Username and password is mandatory!",
      });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({
        error: "Invalid email format!",
      });
    }

    const isConnected = await connectToMongoDb();
    if (!isConnected) {
      return NextResponse.json({
        error: "Can not connect to mongoDb!",
      });
    }

    const userLogin: UserLogin = await checkUserLoginCredentials(userData);

    if (userLogin.isEmailVerified) {
      return NextResponse.json("You are logged in");
    } else if (!userLogin.isPasswordMatched) {
      return NextResponse.json("Wrong credentials!");
    } else {
      const token: string | null = userLogin.verificationToken ?? (await generateHash(email));
      if (token) {
        try {
          await userDb.updateOne({ email: email }, { $set: { verify_token: token } });
        } catch (error) {
          console.log(error);
          return NextResponse.json("Can not insert token in database!");
        }

        const emailData: EmailData = {
          to: email,
          subject: "Email verification",
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
        return NextResponse.json({
          error: "Can not generated token!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json("Login Failed");
  }
}
