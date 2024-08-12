import User from "@/models/User";
import UserDb from "@/dbModels/User";
import jwt from "jsonwebtoken";

const isValidEmail = (email: string): boolean => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isUserExists = async (userEmail: string): Promise<boolean> => {
  const isFound = await UserDb.findOne({ email: userEmail });
  return isFound !== null;
};

const isValidated = async (user: User): Promise<boolean> => {
  const isValidated = await UserDb.findOne({
    email: user.email,
    password: user.password,
  });
  return isValidated !== null;
};

const isEmailVerified = async (
  userEmail: string
): Promise<[boolean | undefined, string | null | undefined]> => {
  const selectedUser = await UserDb.findOne(
    { email: userEmail },
    "is_verified"
  );
  return [selectedUser?.is_verified, selectedUser?.verify_token];
};

const generateToken = async (userEmail: string): Promise<string | null> => {
  const token = await jwt.sign(
    { email: userEmail },
    process.env.SECRET_TOKEN!,
    { expiresIn: "2h" }
  );
  return token;
};

export {
  isValidEmail,
  isUserExists,
  isValidated,
  isEmailVerified,
  generateToken,
};
