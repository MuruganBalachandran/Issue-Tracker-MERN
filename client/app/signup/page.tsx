"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { signup as signupThunk } from "@/redux/slices/authSlice";

interface FormData {
  Name: string;
  Email: string;
  Password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const onSubmit = async (data: FormData) => {
    try {
      const resultAction = await dispatch(
        signupThunk({
          Name: data?.Name,
          Email: data?.Email,
          Password: data?.Password,
        }),
      );

      // Check if signup was successful
      if (signupThunk.fulfilled.match(resultAction)) {
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => router.push("/profile"), 1500);
      } else {
        toast.error(String(resultAction.payload) || "Login failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-white'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Signup</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        {/* Name */}
        <div className='flex flex-col'>
          <input
            {...register("Name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
            placeholder='Name'
            className={`border p-2 rounded ${errors.Name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.Name && (
            <span className='text-red-500 text-sm'>{errors.Name.message}</span>
          )}
        </div>

        {/* Email */}
        <div className='flex flex-col'>
          <input
            {...register("Email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            placeholder='Email'
            className={`border p-2 rounded ${errors.Email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.Email && (
            <span className='text-red-500 text-sm'>{errors.Email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className='flex flex-col'>
          <input
            {...register("Password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type='password'
            placeholder='Password'
            className={`border p-2 rounded ${errors.Password ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.Password && (
            <span className='text-red-500 text-sm'>
              {errors.Password.message}
            </span>
          )}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400'
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        {error && <p className='text-red-500 mt-2'>{error}</p>}
      </form>
    </div>
  );
}
