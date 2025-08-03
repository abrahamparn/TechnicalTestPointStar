import { useForm } from "react-hook-form";
import { useCreateNote } from "../api";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "content is required"),
});

const CreateNoteForm = () => {
  // useForm hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createNoteSchema),
  });
  const { mutate: addNote, isPending } = useCreateNote();

  const onSubmit = (data) => {
    addNote(data, {
      onSuccess: () => {
        console.log("mutation success");
        reset();
      },
      onError: (e) => console.error("mutation error", e),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add a New Note</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            title
          </label>
          <input
            {...register("title", { required: true })}
            id="title"
            type="text"
            placeholder="Title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            content
          </label>
          <textarea
            {...register("content")}
            placeholder="Content..."
            id="content"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isPending ? "Saving..." : "Add Note"}
          </button>
        </div>
      </div>
    </form>
  );
};
export default CreateNoteForm;
