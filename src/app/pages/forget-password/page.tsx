"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useRouter } from "next/navigation";
import isValidEmail from "@/utility/shared/validators";

const Page = () => {
  const [click, setClick] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setClick(true);
    if (!isValidEmail(email)) {
      toast.error("Invalid email address!");
      setClick(false);
    }

    const data = { email: email };
    try {
      const response = await axios.post("/api/forget-password", data);
      if (!response) {
        toast.error("Can not connect to server");
      }
      const { isLinkSent } = response.data;
      if (!isLinkSent) {
        toast.error("Unable to send reset password email. Please try again later.");
      }
      else {
        setEmailSent(true);
      }
    }
    catch (error) {
      console.log(error);
      toast.error("Can not connect to server");
    }
    finally {
      setClick(false);
    }
  };

  const emailSentDiv = (
    <div className="w-[90%] h-[5vh] bg-bg-notice-green text-start mx-6 my-2 p-2 rounded-md shadow-sm border-2">
      We have e-mailed your password reset link if the user exists!
    </div>
  );

  return (
    <div className=" flex justify-center items-center h-screen w-screen bg-custom-green">
      <div className="bg-slate-50  min-h-[30vh] w-[30vw] border gap-4 rounded-xl">
        <div className="flex flex-col justify-start w-[100%]">
          <div className="flex justify-center items-center my-9">
            <label className="font-sans font-bol text-3xl">Forget Password</label>
          </div>
          {emailSent ? emailSentDiv : ""}
          <div className="flex flex-col items-start w-[90%]">
            <input
              className=" border-2 border-gray-200 text-start w-full h-[5vh] mx-6 my-2 p-2 rounded-md shadow-sm"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
            />
          </div>
          <div className="flex justify-start">
            <button
              className="bg-custom-green w-[90%] h-[5vh] flex justify-center items-center mx-6 rounded-md shadow-md text-slate-200 cursor-pointer"
              onClick={handleClick}
            >
              {click ? <PropagateLoader size={15} color={"#7dd87d"} /> : "Submit"}
            </button>
          </div>
          <div className="flex justify-center my-6 w-[90%]">
            <label>
              Don't have an account?{" "}
              <span
                className="text-custom-green cursor-pointer"
                onClick={() => {
                  router.push("/signup");
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
