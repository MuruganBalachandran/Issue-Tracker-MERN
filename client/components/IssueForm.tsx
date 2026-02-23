"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IssueFormProps {
  defaultValues?: {
    Title?: string;
    Description?: string;
    Priority?: string;
    Assignee?: string;
  };
  onSubmit: (data: {
    Title: string;
    Description: string;
    Priority: string;
    Assignee?: string;
  }) => void;
}

export default function IssueForm({ defaultValues, onSubmit }: IssueFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // <-- need this to update form values
  } = useForm({
    defaultValues: {
      Title: defaultValues?.Title || "",
      Description: defaultValues?.Description || "",
      Priority: defaultValues?.Priority || "medium",
      Assignee: defaultValues?.Assignee || "",
    },
  });

  // ⚡ Reset form whenever defaultValues changes
  useEffect(() => {
    reset({
      Title: defaultValues?.Title || "",
      Description: defaultValues?.Description || "",
      Priority: defaultValues?.Priority || "medium",
      Assignee: defaultValues?.Assignee || "",
    });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
      {/* Title */}
      <input
        {...register("Title", { required: "Title is required" })}
        placeholder='Title'
        className={`border p-2 rounded ${errors.Title ? "border-red-500" : "border-gray-300"}`}
      />
      {errors.Title && (
        <span className='text-red-500 text-sm'>{errors.Title.message}</span>
      )}

      {/* Description */}
      <textarea
        {...register("Description", { required: "Description is required" })}
        placeholder='Description'
        className={`border p-2 rounded ${errors.Description ? "border-red-500" : "border-gray-300"}`}
      />
      {errors.Description && (
        <span className='text-red-500 text-sm'>
          {errors.Description.message}
        </span>
      )}

      {/* Priority */}
      <select
        {...register("Priority", { required: true })}
        className='border p-2 rounded'
      >
        <option value='low'>Low</option>
        <option value='medium'>Medium</option>
        <option value='high'>High</option>
      </select>

      {/* Assignee */}
      <input
        {...register("Assignee")}
        placeholder='Assignee (optional)'
        className='border p-2 rounded'
      />

      <button
        type='submit'
        className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
      >
        {defaultValues ? "Update Issue" : "Create Issue"}
      </button>
    </form>
  );
}
