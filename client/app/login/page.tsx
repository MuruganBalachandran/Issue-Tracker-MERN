"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUser, login as loginThunk } from "@/redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  Email: string;
  Password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // mark client-side rendering
    dispatch(fetchUser());
  }, [dispatch]);

  // Redirect if already logged in
  useEffect(() => {
    if (mounted && user) {
      router.push("/profile");
    }
  }, [mounted, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const onSubmit = async (data: FormData) => {
    try {
      const resultAction = await dispatch(
        loginThunk({ Email: data.Email, Password: data.Password }),
      );
      if (loginThunk.fulfilled.match(resultAction)) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => router.push("/profile"), 2000);
      } else {
        toast.error(String(resultAction.payload) || "Login failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
  };

  if (!mounted) return null; // render nothing until client

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-white'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Login</h1>
      <ToastContainer position='top-right' autoClose={3000} />

      {error && <p className='text-red-500 mb-2'>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <input
            {...register("Email", { required: "Email required" })}
            placeholder='Email'
            className='border p-2 rounded'
          />
          {errors.Email && (
            <span className='text-red-500 text-sm'>{errors.Email.message}</span>
          )}
        </div>
        <div className='flex flex-col'>
          <input
            {...register("Password", { required: "Password required" })}
            type='password'
            placeholder='Password'
            className='border p-2 rounded'
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
