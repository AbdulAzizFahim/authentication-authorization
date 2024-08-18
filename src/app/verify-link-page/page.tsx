"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
interface PageData {
  message: string;
  status: string;
  click: boolean;
  buttonLabel: string;
  handleClick: () => void;
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [click, setClick] = useState(false);

  useEffect(() => {
    const token: string = searchParams.get("token") || "";
    const type: string = searchParams.get("type") || "";

    console.log(token + type);

    if (!token || !type) {
      router.push("/404");
    }

    setToken(token);
    setType(type);
  }, [router, searchParams]);

  const link: string = `api/verify-link?token=${token}&type=${type}`;
  let typeMessage: string = "";
  let buttonLabel: string = "";
  if (type === "verifyEmail") {
    typeMessage = "Verify your email";
    buttonLabel = "Verify";
  } else if (type === "forgetPassword") {
    typeMessage = "Reset your password";
    buttonLabel = "Reset";
  }

  const handleClick = async () => {
    try {
      setClick(true);
      const response = await axios.get(link);
      const { isVerified, message } = response.data;
      setStatus(message);
    } catch (error) {
      setStatus("Can not validate link, Try again later.");
    }
  };

  const loadingDiv = (
    <div className="flex justify-center items-center my-9">
      <label className="font-sans font-bol text-3xl">Loading...</label>
    </div>
  );

  const PageDiv: React.FC<PageData> = ({ message, click, handleClick, status, buttonLabel }) => {
    return (
      <div className=" flex justify-center items-center h-screen w-screen bg-custom-green ">
        <div className=" flex bg-slate-50  min-h-[15vh] w-[20vw] border gap-2 rounded-xl justify-center items-center drop-shadow-lg">
          {token === "" ? (
            loadingDiv
          ) : status !== "" ? (
            <div className="w-[90%] h-full  bg-bg-notice-green text-start mx-6 my-2 p-2 rounded-md shadow-sm border-2">
              {status}
            </div>
          ) : (
            <div className="flex flex-col items-center w-full ">
              <div className="flex items-center my-5">
                <label className="font-sans font-bol text-3xl bg-slate-200 p-2 ">{message}</label>
              </div>
              <button
                className="bg-custom-green w-[40%] h-[5vh] my-3 mx-6 rounded-md shadow-md text-slate-200 cursor-pointer"
                onClick={handleClick}
              >
                {click ? <SyncLoader size={10} color={"#7dd87d"} /> : buttonLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <PageDiv
        message={typeMessage}
        status={status}
        click={click}
        handleClick={handleClick}
        buttonLabel={buttonLabel}
      />
    </>
  );
};

export default Page;
