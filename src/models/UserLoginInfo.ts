class UserLogin {
  isUserFound: boolean;
  isPasswordMatched: boolean | null = null;
  isEmailVerified: boolean | null = null;
  verificationToken: string | null = null;
  constructor(
    isFound: boolean,
    isPasswordMatched: boolean | null = null,
    isVerified: boolean | null = null,
    verifyToken: string | null = null
  ) {
    this.isUserFound = isFound;
    this.isPasswordMatched = isPasswordMatched;
    this.isEmailVerified = isVerified;
    this.verificationToken = verifyToken;
  }
}

export default UserLogin;
