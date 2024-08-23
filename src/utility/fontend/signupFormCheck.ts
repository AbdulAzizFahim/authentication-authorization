import { ISignupData } from "@/models/Authentication";
import isValidEmail from "@/utility/shared/validators";

const isSignupFormValid = (data: ISignupData): { isValid: boolean; validMessage: string } => {
  const minUsernameLength: number = 5;

  if (data?.Username?.length < minUsernameLength) {
    return { isValid: false, validMessage: "Username has to be at least 5 characters long!" };
  }
  if (!isValidEmail(data.Email)) {
    return { isValid: false, validMessage: "Invalid email format!" };
  }

  return validatePassword(data?.Password, data?.ConfirmPassword);
};


const validatePassword = (password: string | null, confirmPassword: string | null): { isValid: boolean; validMessage: string } => {
  const minPasswordLength: number = 5;
  if (!password || !confirmPassword) {
    return { isValid: false, validMessage: "Password and confirm password fields are mandatory!" };
  }
  if (password.length < minPasswordLength) {
    return { isValid: false, validMessage: "Password has to be atleast 5 characters long!" };
  }
  if (password !== confirmPassword) {
    return { isValid: false, validMessage: "Password and confirm password has to be exact match!" };
  }
  return { isValid: true, validMessage: "Success" };
}

export { isSignupFormValid, validatePassword };
