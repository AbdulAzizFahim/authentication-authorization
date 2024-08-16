'use client'

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PacmanLoader from "react-spinners/PacmanLoader";

const Page = () => {
    const [click, setClick] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleClick = async () => {
        setClick(true);
        const data = { email: email, password: password };
        try {
            const response = await axios.post("/api/login", data);
            if (!response) {
                toast.error("Can not connect to server");
            }
            const { isVerified, isTokenSent, message } = response.data;
            toast.success(message);
            if (isVerified) {
            }
            else if(isTokenSent){

            }
        } catch (error) {
            console.log(error);
            toast.success("Can not connect to server");
        } finally {
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
                        <input
                            className=" border-2 border-gray-200 text-start w-full h-[5vh] mx-6 my-2 p-2 rounded-md shadow-sm"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email"
                        />
                        <input
                            className=" border-2 border-gray-200 text-start w-full h-[5vh] mx-6 my-2 p-2 rounded-md shadow-sm"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your Password"
                        />
                    </div>
                    <div className="mx-7 my-2">
                        <label className=" text-custom-green cursor-pointer">
                            Forgot password?
                        </label>
                    </div>
                    <div className="flex justify-start">
                        <button
                            className="bg-custom-green w-[90%] h-[5vh] flex justify-center items-center mx-6 rounded-md shadow-md text-slate-200 cursor-pointer"
                            onClick={handleClick}
                        >
                            {click ? <PacmanLoader size={15} color={'#7dd87d'} /> : "Login"}
                        </button>
                    </div>
                    <div className="flex justify-center mt-6 w-[90%]">
                        <label>
                            Don't have an account?{" "}
                            <span className="text-custom-green cursor-pointer">Signup</span>
                        </label>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Page;
