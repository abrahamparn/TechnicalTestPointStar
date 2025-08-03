import { useForm } from "react-hook-form";
import { useUpdateNote } from "../api";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const EditNoteForm = ({ noteToEdit, onClose }) => {
  const registerSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "content is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  const { mutate: editNote, isPending } = useUpdateNote();

  useEffect(() => {
    if (noteToEdit) {
      reset({ title: noteToEdit.title, content: noteToEdit.content });
    }
  }, [noteToEdit, reset]);

  const onSubmit = (data) => {
    editNote(
      { noteId: noteToEdit.note_id, data },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
      <div>
        <input
          {...register("title")}
          placeholder="Title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <textarea
          {...register("content")}
          placeholder="Content..."
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditNoteForm;
