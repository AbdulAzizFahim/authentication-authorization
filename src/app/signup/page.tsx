"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import axios from "axios";
import { useRouter } from "next/navigation";
import UsernameIcon from "../components/usernameIcon";
import PasswordIcon from "../components/passwordIcon";
import EmailIcon from "../components/emailIcon";

const Page = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [click, setClick] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setClick(true);
    if (password !== confirmPassword) {
      toast.error("The password and confirm password fields must match");
      setClick(false);
      return;
    }

    try {
      const link: string = "/api/signup";
      const data = {
        email: email,
        password: password,
        username: username,
      };
      const response = await axios.post(link, data);
      const { isAuthenticated, message } = response.data;
      if (isAuthenticated) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Can not signup user!");
    } finally {
      setClick(false);
    }
  };

  return (
    <div className=" flex justify-center items-center h-screen w-screen bg-custom-green">
      <div className="bg-slate-50 h-[55vh] w-[30vw] border gap-4 rounded-xl">
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="flex items-start mx-6 w-full">
              <EmailIcon />
              <input
                className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                type="password"
                value={password}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="flex items-start mx-6 w-full">
              <PasswordIcon />
              <input
                className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-start mx-6 w-full">
              <PasswordIcon />
              <input
                className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          <div className="flex justify-center mt-6 w-[90%]">
            <label>
              Already have an account?
              <span
                className="text-custom-green cursor-pointer ml-2"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
