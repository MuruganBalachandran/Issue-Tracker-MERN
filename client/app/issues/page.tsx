"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchIssues,
  removeIssue,
  addIssue,
  editIssue,
} from "@/redux/slices/issueSlice";
import ProtectedRoute from "@/components/protectedRoute";
import ConfirmModal from "@/components/ConfirmModal";
import OffCanvasWrapper from "@/components/OffCanvasWrapper";
import IssueForm from "@/components/IssueForm";

export default function IssuesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { issues, loading } = useSelector((state: RootState) => state.issues);

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

  // Fetch issues on mount
  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch]);

  // --- Delete handlers ---
  const handleDelete = (id: string) => {
    setSelectedIssueId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedIssueId) {
      dispatch(removeIssue(selectedIssueId));
      setSelectedIssueId(null);
      setIsModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setSelectedIssueId(null);
    setIsModalOpen(false);
  };

  // --- Open OffCanvas for Create/Edit ---
  const openCreate = () => {
    setSelectedIssueId(null);
    setIsOffCanvasOpen(true);
  };

  const openEdit = (id: string) => {
    setSelectedIssueId(id);
    setIsOffCanvasOpen(true);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <div className='p-6'>
        <h1 className='text-2xl font-bold mb-4'>Issues</h1>

        <button
          onClick={openCreate}
          className='bg-green-500 text-white px-4 py-2 rounded mb-4'
        >
          Create New Issue
        </button>

        <table className='w-full border'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border px-2 py-1'>Title</th>
              <th className='border px-2 py-1'>Status</th>
              <th className='border px-2 py-1'>Priority</th>
              <th className='border px-2 py-1'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td className='border px-2 py-1'>{issue.Title}</td>
                <td className='border px-2 py-1'>{issue.Status}</td>
                <td className='border px-2 py-1'>{issue.Priority}</td>
                <td className='border px-2 py-1 space-x-2'>
                  <button
                    onClick={() => openEdit(issue.Issue_Id)}
                    className='bg-yellow-500 text-white px-2 py-1 rounded'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(issue.Issue_Id)}
                    className='bg-red-500 text-white px-2 py-1 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- Confirm Delete Modal --- */}
        <ConfirmModal
          isOpen={isModalOpen}
          title='Delete Issue'
          message='Are you sure you want to delete this issue?'
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />

        {/* --- OffCanvas for Create/Edit --- */}
        <OffCanvasWrapper
          isOpen={isOffCanvasOpen}
          onClose={() => {
            setIsOffCanvasOpen(false);
            setSelectedIssueId(null);
          }}
          title={selectedIssueId ? "Edit Issue" : "Create Issue"}
        >
          <IssueForm
            defaultValues={
              selectedIssueId
                ? issues?.find((i) => i?.Issue_Id === selectedIssueId)
                : undefined
            }
            onSubmit={(data: any) => {
              if (selectedIssueId) {
                dispatch(editIssue({ id: selectedIssueId, data }));
              } else {
                dispatch(addIssue(data));
              }
              setIsOffCanvasOpen(false);
              setSelectedIssueId(null);
            }}
          />
        </OffCanvasWrapper>
      </div>
    </ProtectedRoute>
  );
}
