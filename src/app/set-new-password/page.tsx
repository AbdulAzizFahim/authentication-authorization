"use client"

import React, { useEffect, useState } from 'react'
import PasswordIcon from '../components/passwordIcon';
import { validatePassword } from '@/utility/fontend/signupFormCheck';
import { useRouter, useSearchParams } from "next/navigation";
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import axios from 'axios';

const Page = () => {
    const [data, setData] = useState({ password: '', confirmPassword: '', token: '' })
    const [click, setClick] = useState(false);
    const [reset, setReset] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token: string = searchParams.get("token") || "";
        if (!token) {
            router.push('/404');
        }
        setData({ ...data, 'token': token });
    }, [router, searchParams, data]);

    const loadingDiv = (
        <div className="flex justify-center items-center my-9">
            <label className="font-sans font-bol text-3xl text-center">Loading...</label>
        </div>
    );

    const passwordResetDiv = (
        <div className="w-[90%] h-[5vh] bg-bg-notice-green text-center mx-6 my-2 p-2 rounded-md shadow-sm border-2">
            Password has been reset successfully.
        </div>
    );

    const handleClick = async () => {
        setClick(false);
        const { isValid, validMessage } = validatePassword(data.password, data.confirmPassword);
        if (!isValid) {
            toast.error(validMessage);
            setClick(true);
            return;
        }

        const link = await axios.post("/api/create-new-password", { ...data, });

    }

    return (
        <div className=" flex justify-center items-center h-screen w-screen bg-custom-green">
            <div className="bg-slate-50 h-fit w-[30vw] border gap-4 rounded-xl">
                {
                    data.token === "" ? loadingDiv : (
                        reset ? passwordResetDiv : <div className="flex flex-col justify-start w-[100%]">
                            <div className="flex justify-center items-center my-9">
                                <label className="font-sans font-bol text-3xl">Create new password</label>
                            </div>
                            <div className="flex flex-col items-start w-[90%]">
                                <div className="flex items-start mx-6 w-full">
                                    <PasswordIcon />
                                    <input
                                        className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="flex items-start mx-6 w-full">
                                    <PasswordIcon />
                                    <input
                                        className="border-2 border-gray-200 text-start w-full h-[5vh] my-2 p-2 rounded-r-md shadow-sm"
                                        type="password"
                                        value={data.confirmPassword}
                                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <button
                                    className="bg-custom-green w-[90%] h-[5vh] m-6 rounded-md shadow-md text-slate-200 cursor-pointer"
                                    onClick={handleClick}
                                >
                                    {click ? <PropagateLoader size={15} color={"#7dd87d"} /> : "Submit"}
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Page