import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import isValidEmail from "@/helpers/checker";
import connectToMongoDb from "@/helpers/dbConnect";

interface User {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const userData: User = await req.json();
    if (!userData.email || !userData.password) {
      return NextResponse.json("Invalid email address and password!");
    }

    if (!isValidEmail(userData.email)) {
      return NextResponse.json("Invalid email address!");
    }

    const isConnected: boolean = await connectToMongoDb();
    if (!isConnected) {
      return NextResponse.json("Can not connect to mongoDb!");
    }
    return NextResponse.json("MongoDb connected!");
  } 
  catch (error) {
    console.log(error);
    return NextResponse.json("Login Failed");
  }

  // const jwtToken: string = jwt.sign(userData.email, process.env.TOKEN_SECRET!, { expiresIn: "1h" });
  // return NextResponse.json(jwtToken);
}
