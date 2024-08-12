import { NextRequest, NextResponse } from "next/server";
import {
  isValidEmail,
  isValidated,
  isEmailVerified,
  generateToken,
} from "@/helpers/checker";
import connectToMongoDb from "@/helpers/dbConnect";
import User from "@/models/User";
import userDb from "@/dbModels/User";

export async function POST(req: NextRequest) {
  try {
    const userData: User = await req.json();
    const { email, password } = userData;

    if (!email || !password) {
      return NextResponse.json({
        error: "Invalid email address and password!",
      });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({
        error: "Invalid email address!",
      });
    }

    const isConnected = await connectToMongoDb();
    if (!isConnected) {
      return NextResponse.json({
        error: "Can not connect to mongoDb!",
      });
    }

    const isValid = await isValidated(userData);
    if (!isValid) {
      return NextResponse.json({
        error: "Invalid User credentails",
      });
    }

    const [isVerified, verifyToken] = await isEmailVerified(email);

    if (isVerified) {
      return NextResponse.json("You are logged in");
    } else if (verifyToken) {
      return NextResponse.json(verifyToken);
    } else {
      const token = await generateToken(email);
      if (token) {
        try {
          await userDb.updateOne(
            { email: email },
            { $set: { verify_token: token } }
          );
        } catch (error) {
          console.log(error);
          return NextResponse.json("Can not insert token in database!");
        }
        return NextResponse.json(token);
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
