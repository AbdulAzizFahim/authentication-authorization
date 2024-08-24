import { ILoginData } from "@/models/Authentication";
import isValidEmail from "@/utility/shared/validators";

const isLoginFormValid = (data: ILoginData): { isValid: boolean; validMessage: string } => {
  if (!isValidEmail(data.Email)) {
    return { isValid: false, validMessage: "Invalid email format!" };
  }
  return { isValid: true, validMessage: "Success" };
};

export default isLoginFormValid;
