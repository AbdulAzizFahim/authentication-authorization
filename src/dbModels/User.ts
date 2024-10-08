import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  email_verify_token: { type: String, default: null },
  reset_password_token: { type: String, default: null },
  token_expiry_date: { type: Date, default: null },
  refresh_token: { type: String, default: null },
});

const UserDb = mongoose.models.users || mongoose.model("users", userSchema);

export default UserDb;
