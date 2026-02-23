"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUser, logout as logoutThunk } from "@/redux/slices/authSlice";
import ProtectedRoute from "@/components/protectedRoute";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch user on mount
  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setShowLogoutModal(false);
    }
  };
  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <div className='max-w-md mx-auto mt-10'>
        <h1 className='text-2xl font-bold mb-4'>Profile</h1>
        <p>
          <strong>Name:</strong> {user?.Name}
        </p>
        <p>
          <strong>Email:</strong> {user?.Email}
        </p>
        <p>
          <strong>Role:</strong> {user?.Role}
        </p>

        <button
          onClick={() => setShowLogoutModal(true)}
          className='mt-4 bg-red-500 text-white p-2 rounded'
        >
          Logout
        </button>
        <ConfirmModal
          isOpen={showLogoutModal}
          title='Logout'
          message='Are you sure you want to logout?'
          confirmText='Logout'
          cancelText='Cancel'
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
