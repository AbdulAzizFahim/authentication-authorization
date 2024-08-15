import User from "@/models/User";
import UserLogin from "@/models/UserLoginInfo";
import UserDb from "@/dbModels/User";
import { comparePassword } from "./hashHelper";

const isValidEmail = (email: string): boolean => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkUserLoginCredentials = async (userData: User): Promise<UserLogin> => {
  const selectedUser = await UserDb.findOne({ email: userData.email });
  if (selectedUser == null) {
    return new UserLogin(false);
  }

  const isPasswordMatched = await comparePassword(userData.password, selectedUser.password);
  if (!isPasswordMatched) {
    return new UserLogin(true, false);
  }

  return new UserLogin(true, true, selectedUser.is_verified, selectedUser.email_verify_token);
};

export { isValidEmail, checkUserLoginCredentials };
