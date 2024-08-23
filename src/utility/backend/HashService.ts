import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateHash = async (data: string): Promise<string> => {
  try {
    const rounds: number = 10;
    const hashedToken = await bcrypt.hash(data, rounds);
    return hashedToken;
  } catch (error) {
    throw new Error("Error generating hash!");
  }
};

const comparePassword = async (plainText: string, hashedText: string) => {
  try {
    const isMatch = await bcrypt.compare(plainText, hashedText);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing hash!");
  }
};

const generateJwtToken = async (userEmail: string): Promise<string> => {
  try {
    const token = await jwt.sign({ email: userEmail }, process.env.SECRET_TOKEN!, {
      expiresIn: "2h",
    });
    return token;
  } catch (error) {
    throw new Error("Can not generate token!");
  }
};

export { generateHash, comparePassword, generateJwtToken };
