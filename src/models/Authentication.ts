interface ILoginData {
  Email: string;
  Password: string;
}

interface ISignupData {
  Username: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

enum verificationType {
  verifyEmail = "verifyEmail",
  forgetPassword = "forgetPassword",
}

export { type ILoginData, type ISignupData, verificationType };
