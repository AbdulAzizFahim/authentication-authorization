import { NextRequest, NextResponse } from "next/server";
import { generateHashToken } from "@/utility/hashHelper";
import { isValidEmail, checkUserLoginCredentials } from "@/utility/loginValidator";
import sendEmail from "@/utility/emailSender";
import connectToMongoDb from "@/utility/dbConnect";
import User from "@/models/User";
import userDb from "@/dbModels/User";
import EmailData from "@/models/EmailData";
import UserLogin from "@/models/UserLoginInfo";
import moment from "moment";
import { setAccessToken } from "@/utility/tokenService";

export async function POST(req: NextRequest) {
  try {
    const userData: User = await req.json();
    const { email, password } = userData;

    if (!email || !password) {
      return NextResponse.json(
        { isVerified: false, message: "Username and password missing!" },
        { status: 200 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { isVerified: false, message: "Please use a valid email!" },
        { status: 200 }
      );
    }

    const isConnected = await connectToMongoDb();
    if (!isConnected) {
      return NextResponse.json(
        { isVerified: false, message: "Can not validate user!" },
        { status: 200 }
      );
    }

    const userLogin: UserLogin = await checkUserLoginCredentials(userData);

    if (userLogin.isEmailVerified) {
      const response = NextResponse.json(
        { isVerified: true, message: "User Authenticated" },
        { status: 200 }
      );

      setAccessToken(email, response);
      return response;
    } else if (!userLogin.isPasswordMatched) {
      return NextResponse.json(
        { isVerified: false, message: "Invalid user credentials!" },
        { status: 200 }
      );
    } else {
      const token: string | null = userLogin.verificationToken ?? (await generateHashToken(email));
      if (token) {
        try {
          const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
          const expiryDateTime = moment().utc().add(expiryDuration, "hours").toDate();
          await userDb.updateOne(
            { email: email },
            { $set: { email_verify_token: token, token_expiry_date: expiryDateTime } }
          );
        } catch (error) {
          console.log(error);
          return NextResponse.json(
            { isVerified: false, message: "Can not validate user!" },
            { status: 200 }
          );
        }

        const emailData: EmailData = {
          to: email,
          subject: "Email verification",
          text: "Click the following link for email verfication.",
          html: `Click the following link for email verfication.
          <br> 
          <a href="http://localhost:3000/verify-link-page?token=${token}&type=verifyEmail"> 
            Click Me 
          </a>
          `,
        };

        await sendEmail(emailData);
        return NextResponse.json(
          { isVerified: false, isTokenSent: true, message: "Can not validate user!" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { isVerified: false, message: "Can not validate user!" },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { isVerified: false, message: "Can not validate user!" },
      { status: 200 }
    );
  }
}
