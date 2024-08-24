import UserDb from '@/dbModels/User';
import { ISignupData } from '@/models/Authentication';
import moment from 'moment';
import mongoose from 'mongoose';

import isValidEmail from '../shared/validators';

import { generateHash } from './HashService';

const connectToMongoDb = async () => {
  if (mongoose?.connection?.readyState !== 0) {
    return;
  }

  try {
    const database: mongoose.Mongoose = await mongoose.connect(process.env.MONGODB_URI!);
    if (database.connection.readyState !== 0) {
      return;
    }
    else {
      throw new Error('Can not connect to database');
    }
  }
  catch (error) {
    throw new Error('Can not connect to database');
  }
};

const dbUpdateEmailVerifyToken = async (email: string, token: string, expiryDateTime: Date) => {
  if (!email || !token || !expiryDateTime || !isValidEmail(email)) {
    throw new Error('Invalid parameters');
  }
  try {
    connectToMongoDb();
    await UserDb.updateOne({ email: email },
      { $set: { email_verify_token: token, token_expiry_date: expiryDateTime } });
  }
  catch (error) {
    throw new Error('Can not updated database!');
  }
};

const dbUpdateForgetPasswordToken = async (email: string, token: string, expiryDateTime: Date) => {
  if (!email || !token || !isValidEmail(email)) {
    throw new Error('Can not update forget password token')
  }
  try {
    const expiryDuration = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime = moment().utc().add(expiryDuration, "hours").toDate();
    await UserDb.updateOne({ email: email },
      { $set: { reset_password_token: token, token_expiry_date: expiryDateTime } });
  }
  catch (error) {
    throw new Error('Can not update forget password token')
  }
}

const isUserExists = async (email: string) => {
  await connectToMongoDb();
  const user = await UserDb.findOne({ email: email });
  return user;
};

const createNewUser = async (data: ISignupData, token: string) => {
  try {
    if (!data || !token) {
      throw new Error('Incorrect parameters!');
    }

    const expiryDuration: number = parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRY_HOUR!);
    const expiryDateTime: Date = moment().utc().add(expiryDuration, 'hours').toDate();
    const newUser = await new UserDb({
      email: data.Email,
      password: await generateHash(data.Password),
      username: data.Username,
      email_verify_token: token,
      token_expiry_date: expiryDateTime,
    });
    await newUser.save();
  }
  catch (error) {
    throw new Error('Can not create new user!');
  }
};

const isResetPasswordTokenExists = async (token: string) => {
  try {
    connectToMongoDb();
    const user = await UserDb.findOne({ reset_password_token: token });
    return user;
  }
  catch (error) {
    throw new Error('Can not connect to database');
  }
}

const setUserVerified = async (user: any) => {
  if (!user) {
    throw new Error('Invalid user deatails');
  }

  try {
    connectToMongoDb();
    user.is_verified = true;
    user.email_verify_token = null;
    user.token_expiry_date = null;
    await user.save();
  }
  catch (error) {
    throw new Error('Can not updated user details');
  }

}

export {
  connectToMongoDb,
  dbUpdateEmailVerifyToken,
  isUserExists,
  createNewUser,
  dbUpdateForgetPasswordToken,
  isResetPasswordTokenExists,
  setUserVerified,
};
