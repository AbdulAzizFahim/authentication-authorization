"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import axios from "axios";
import UsernameIcon from "../components/usernameIcon";
import PasswordIcon from "../components/passwordIcon";
import EmailIcon from "../components/emailIcon";
import { ISignupData } from "@/models/Authentication";
import { isSignupFormValid } from "@/utility/fontend/signupFormCheck";
import Link from "next/link";

const Page = () => {
  const [signupData, setSignupData] = useState<ISignupData>({
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [click, setClick] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleClick = async () => {
    setClick(true);
    const { isValid, validMessage } = isSignupFormValid(signupData);
    if (!isValid) {
      toast.error(validMessage);
      setClick(false);
      return;
    }

    try {
      const link = "/api/signup";
      const response = await axios.post(link, signupData);
      const { isAuthenticated, message } = response.data;
      if (isAuthenticated) {
        setEmailSent(true);
      }
      else {
        toast.error(message);
      }
    }
    catch (error) {
      toast.error("Can not signup user!");
    }
    finally {
      setClick(false);
    }
  };
  const AuthenticationCompleteDiv = (
    <div className="w-[90%] h-[8vh] bg-bg-notice-green text-center mx-6 my-2 p-2 rounded-md shadow-sm border-2">
      We have sent you a verification link on your email. Please check spambox too.
    </div>
  );

  return (
    <div className=" flex justify-center items-center h-screen w-screen bg-custom-green">
      <div className="bg-slate-50 h-fit w-[30vw] border gap-4 rounded-xl">
        {
          emailSent ? AuthenticationCompleteDiv :
            <div className="flex flex-col justify-start w-[100%]">
              <div className="flex justify-center items-center my-9">
                <label className="font-sans font-bol text-3xl">Signup</label>
              </div>
              <div className="flex flex-col items-start w-[90%]">
                <div className="flex items-start mx-6 w-full">
                  <UsernameIcon />
                  <input
                    className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                    type="text"
                    value={signupData.Username}
                    onChange={(e) => setSignupData({ ...signupData, Username: e.target.value })}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="flex items-start mx-6 w-full">
                  <EmailIcon />
                  <input
                    className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                    type="text"
                    value={signupData.Email}
                    onChange={(e) => setSignupData({ ...signupData, Email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex items-start mx-6 w-full">
                  <PasswordIcon />
                  <input
                    className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                    type="password"
                    value={signupData.Password}
                    onChange={(e) => setSignupData({ ...signupData, Password: e.target.value })}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-start mx-6 w-full">
                  <PasswordIcon />
                  <input
                    className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                    type="password"
                    value={signupData.ConfirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, ConfirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
              <div className="flex justify-start">
                <button
                  className="bg-custom-green w-[90%] h-[5vh] mx-6 rounded-md shadow-md text-slate-200 cursor-pointer"
                  onClick={handleClick}
                >
                  {click ? <PropagateLoader size={15} color={"#7dd87d"} /> : "Signup"}
                </button>
              </div>
              <div className="flex justify-center m-6 w-[90%]">
                <label>
                  Already have an account?
                  <Link
                    className="text-custom-green cursor-pointer ml-2"
                    href="/login"
                  >
                    Login
                  </Link>
                </label>
              </div>
            </div>
        }
      </div>
    </div>
  );
};

export default Page;
