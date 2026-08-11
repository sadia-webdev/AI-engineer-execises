"use client";

import { useForm } from "react-hook-form";
import { signup } from "@/server/users";
import { useState } from "react";

const SignupPage = () => {
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  
  const onSubmit = (data: any) => {
    signup(data.email, data.password)
      .then(() => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className='flex  flex-col items-center justify-center h-screen'>
      <h2 className='my-3 text-2xl'>Create account</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-[300px] flex-col gap-4'
      >
        <input
          className='border border-gray-300 rounded-md p-2'
          type='email'
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        <input
          className='border border-gray-300 rounded-md p-2'
          type='password'
          {...register("password", {
            required: true,
            minLength: 2,
            maxLength: 20,
          })}
        />
        <button
          className='bg-rose-500 cursor-pointer text-white rounded-md p-2'
          type='submit'
        >
          Signup
        </button>
      </form>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default SignupPage;
