import { isUserExists } from "@/utility/backend/DbService";
import { generateHash } from "@/utility/backend/HashService";
import { createAndSendResetPasswordMail } from "@/utility/backend/EmailService";
import { dbUpdateForgetPasswordToken } from "@/utility/backend/DbService";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const user = await isUserExists(email);
    if (!user || !user.is_verified) {
      return NextResponse.json({ isLinkSent: false });
    }

    const token = await generateHash(email);
    await createAndSendResetPasswordMail(email, token);

    const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime = moment().utc().add(expiryDuration, "hours").toDate();
    await dbUpdateForgetPasswordToken(email, token, expiryDateTime);
    return NextResponse.json({ isLinkSent: true });
  }
  catch (error) {
    return NextResponse.json({ isLinkSent: false });
  }
}
