'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { useRouter } from 'next/navigation';
import UsernameIcon from '../components/usernameIcon';
import PasswordIcon from '../components/passwordIcon';
import isLoginFormValid from '../../utility/fontend/loginFormCheck';
import { ILoginData } from '@/models/Authentication';

const Page = () => {
  const [loginData, setLoginData] = useState<ILoginData>({
    Email: '',
    Password: '',
  });
  const [click, setClick] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    const { isValid, validMessage } = isLoginFormValid(loginData);
    if (!isValid) {
      toast.error(validMessage);
      return;
    }

    setClick(true);
    try {
      const response = await axios.post('/api/login', loginData);
      if (!response) {
        toast.error('Can not connect to server');
      }
      const { isVerified, isTokenSent, message } = response.data;
      if (isVerified) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
    catch (error) {
      console.log(error);
      toast.error('Can not connect to server');
    }
    finally {
      setClick(false);
    }
  };

  return (
    <div className=" flex justify-center items-center h-screen w-screen bg-custom-green">
      <div className="bg-slate-50 h-[45vh] w-[30vw] border gap-4 rounded-xl">
        <div className="flex flex-col justify-start w-[100%]">
          <div className="flex justify-center items-center my-9">
            <label className="font-sans font-bol text-3xl">Login</label>
          </div>
          <div className="flex flex-col items-start w-[90%]">
            <div className="flex items-start mx-6 w-full">
              <UsernameIcon />
              <input
                className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                type="text"
                value={loginData.Email}
                onChange={(e) => setLoginData({ ...loginData, Email: e.target.value })}
                placeholder="Enter your Email"
              />
            </div>
            <div className="flex items-start mx-6 w-full">
              <PasswordIcon />
              <input
                className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                type="password"
                value={loginData.Password}
                onChange={(e) => setLoginData({ ...loginData, Password: e.target.value })}
                placeholder="Enter your Password"
              />
            </div>
          </div>
          <div className="mx-7 my-2">
            <label
              className=" text-custom-green cursor-pointer"
              onClick={() => {
                router.push('/forget-password');
              }}
            >
              Forgot password?
            </label>
          </div>
          <div className="flex justify-start">
            <button
              className="bg-custom-green w-[90%] h-[5vh] flex justify-center items-center mx-6 rounded-md shadow-md text-slate-200 cursor-pointer"
              onClick={handleClick}
            >
              {click ? <PropagateLoader size={15} color={'#7dd87d'} /> : 'Login'}
            </button>
          </div>
          <div className="flex justify-center mt-6 w-[90%]">
            <label>
              Don't have an account?
              <span
                className="text-custom-green cursor-pointer ml-2"
                onClick={() => {
                  router.push('/signup');
                }}
              >
                Signup
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
