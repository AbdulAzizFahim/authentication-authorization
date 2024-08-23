import {ILoginData} from '@/models/Authentication';
import UserLogin from '@/models/UserLoginInfo';

import {isUserExists} from './DbService';
import {comparePassword} from './HashService';

const checkUserLoginCredentials = async(userData: ILoginData): Promise<UserLogin> => {
  const selectedUser = await isUserExists(userData.Email);
  if (selectedUser == null) {
    return new UserLogin(false);
  }

  const isPasswordMatched = await comparePassword(userData.Password, selectedUser.password);
  if (!isPasswordMatched) {
    return new UserLogin(true, false);
  }

  return new UserLogin(true, true, selectedUser.is_verified, selectedUser.email_verify_token);
};

export {checkUserLoginCredentials};
