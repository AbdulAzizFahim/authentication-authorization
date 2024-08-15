"use client"
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface PageData {
    message: string;
    status: string;
    showButton: boolean;
    handleClick: () => void;
}

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        const token: string = searchParams.get('token') || '';
        const type: string = searchParams.get('type') || '';

        console.log(token + type);

        if (!token || !type) {
            router.push('/404');
        }

        setToken(token);
        setType(type);
    }, [router, searchParams]);

    const link: string = `api/verify-link?token=${token}&type=${type}`;
    let message = 'Click the following email to ';
    if (type === 'verifyEmail') {
        message = `${message} verify your email.`
    }
    else if (type === 'forgetPassword') {
        message = `${message} reset your password.`
    }

    const handleClick = async () => {
        try {
            setStatus('Loading...');
            const response = await axios.get(link);
            const { isVerified, message } = response.data;
            if (isVerified) {
                setShowButton(false);
            }
            setStatus(message)
        } catch (error) {
            setStatus('Error');
        }
    };

    const loadingDiv = <div>Loading...</div>;
    const PageDiv: React.FC<PageData> = ({ message, showButton, handleClick }) =>
    (
        <div>
            <div><label>{message}</label></div>
            {
                showButton &&
                <div>
                    <button onClick={handleClick}>Click Here</button>
                </div>
            }
            <div> {status} </div>
        </div>
    )

    return (
        <div>
            {
                token === '' ? loadingDiv :
                    <PageDiv message={message}
                        status={status}
                        showButton={showButton}
                        handleClick={handleClick}
                    />
            }
        </div >
    )
}

export default Page;