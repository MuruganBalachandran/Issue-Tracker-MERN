"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUser } from "@/redux/slices/authSlice";

// Icons
import {
  AiOutlineUser,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { BiTask } from "react-icons/bi";

export default function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // helper for active link styling
  const linkClasses = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 ${
      pathname === path ? "bg-gray-700" : ""
    }`;

  return (
    <aside className='w-64 bg-gray-800 text-white p-6 flex flex-col gap-4'>
      <h2 className='text-2xl font-bold mb-6'>Issue Tracker</h2>

      {!user && (
        <>
          <Link href='/login' className={linkClasses("/login")}>
            <AiOutlineLogin size={20} /> Login
          </Link>
          <Link href='/signup' className={linkClasses("/signup")}>
            <AiOutlineUserAdd size={20} /> Signup
          </Link>
        </>
      )}

      {user && (
        <>
          <Link href='/profile' className={linkClasses("/profile")}>
            <AiOutlineUser size={20} /> Profile
          </Link>
          <Link href='/issues' className={linkClasses("/issues")}>
            <BiTask size={20} /> Issues
          </Link>
        </>
      )}
    </aside>
  );
}
