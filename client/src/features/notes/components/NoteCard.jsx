import { useDeleteNote } from "../api";

const NoteCard = ({ note, onEdit, onSummarize }) => {
  const { mutate: removeNote, isPending } = useDeleteNote();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      removeNote(note.note_id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h3 className="text-xl font-bold mb-2">{note.title}</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
      <div className="mt-4 flex gap-2 w-full justify-between">
        <div className="flex flex-row justify-between gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => onEdit(note)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
        <button
          onClick={() => onSummarize(note)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-black bg-amber-200 rounded hover:bg-amber-700"
        >
          Summarize
        </button>
      </div>
    </div>
  );
};
export default NoteCard;
