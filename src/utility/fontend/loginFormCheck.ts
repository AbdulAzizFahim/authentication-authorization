import { ILoginData } from "@/models/Authentication";
import isValidEmail from "@/utility/shared/validators";

const isLoginFormValid = (data: ILoginData): { isValid: boolean; validMessage: string } => {
  if (!isValidEmail(data.Email)) {
    return { isValid: false, validMessage: "Invalid email format!" };
  }
  if (data.Password?.length) {
    return { isValid: false, validMessage: "Password has to be atleast 6 characters long" };
  }
  return { isValid: true, validMessage: "Success" };
};

export default isLoginFormValid;
