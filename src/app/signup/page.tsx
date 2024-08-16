import React from 'react'

const Page = () => {
    return (
        <div className=" flex justify-center items-center h-screen w-screen bg-custom-green">
            <div className="bg-slate-50 h-[55vh] w-[30vw] border gap-4 rounded-xl">
                <div className='flex flex-col justify-start w-[100%]'>
                    <div className='flex justify-center items-center my-9'>
                        <label className='font-sans font-bol text-3xl'>Login</label>
                    </div>
                    <div className='flex flex-col items-start w-[90%]'>
                        <input className=' border-2 border-gray-200 text-start w-full h-[5vh] mx-6 my-2 p-2 rounded-md shadow-sm' type='text' placeholder='Enter your Username' />
                        <input className=' border-2 border-gray-200 text-start w-full h-[5vh] mx-6 my-2 p-2 rounded-md shadow-sm' type='text' placeholder='Enter your Email' />
                        <input className=' border-2 border-gray-200 text-start w-full h-[5vh] mx-6 my-2 p-2 rounded-md shadow-sm' type='password' placeholder='Enter your Password' />
                        <input className=' border-2 border-gray-200 text-start w-full h-[5vh] mx-6 my-2 p-2 rounded-md shadow-sm' type='password' placeholder='Confirm your Password' />
                    </div>
                    <div className='flex justify-start'>
                        <button className='bg-custom-green w-[90%] h-[5vh] mx-6 rounded-md shadow-md text-slate-200 cursor-pointer'>Login</button>
                    </div>
                    <div className='flex justify-center mt-6 w-[90%]'>
                        <label>Already have an account? <span className='text-custom-green cursor-pointer'>Signup</span></label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page