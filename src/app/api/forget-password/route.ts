import UserDb from "@/dbModels/User";
import connectToMongoDb from "@/utility/dbConnect";
import sendEmail from "@/utility/emailSender";
import { generateHashToken } from "@/utility/hashHelper";
import { isUserExists } from "@/utility/loginValidator";
import EmailData from "@/models/EmailData";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    connectToMongoDb();
    const { email } = await req.json();
    const user = await isUserExists(email);
    if (!user || !user.is_verified) {
      return NextResponse.json({ isLinkSent: false }, { status: 200 });
    }

    const token = await generateHashToken(email);
    const emailData: EmailData = {
      to: email,
      subject: "Reset account password",
      html: `"Click the following link to reset your password."
    <br> 
      <a href="http://localhost:3000/verify-link-page?token=${token}&type=forgetPassword">
          Click Me 
      </a>
      `,
    };
    sendEmail(emailData);

    const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime = moment().utc().add(expiryDuration, "hours").toDate();
    await UserDb.updateOne(
      { email: email },
      { $set: { reset_password_token: token, token_expiry_date: expiryDateTime } }
    );
    return NextResponse.json({ isLinkSent: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isLinkSent: false, hasError: true }, { status: 200 });
  }
}
