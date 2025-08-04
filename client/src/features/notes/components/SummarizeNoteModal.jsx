import { useSummarizeNote } from "../api";
import { useEffect } from "react";
const SummarizeNoteModal = ({ isOpen, onClose, noteToSummarize }) => {
  const { mutate, data, isPending, isSuccess, isError, error, reset } = useSummarizeNote();

  //logic on closing and opening modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (noteToSummarize) {
        mutate(noteToSummarize.note_id);
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      reset();
    };
  }, [isOpen, noteToSummarize, mutate, reset]); // Dependencies for the effect

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-2xl font-bold mb-4">AI-Powered Summary</h2>

        <div className="p-4 border rounded-md bg-gray-50 min-h-[200px] flex items-center justify-center">
          {isPending && <p className="text-gray-600">Generating summary, please wait...</p>}

          {isSuccess && (
            <div className="w-full">
              <h3 className="font-semibold mb-2 text-gray-800">Summary:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {data?.summary || "No summary was returned."}
              </p>
            </div>
          )}

          {isError && (
            <div className="text-center">
              <h3 className="font-semibold text-red-600 mb-2">Could Not Generate Summary</h3>
              <p className="text-gray-600">
                The AI is currently unavailable. Please try again later.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-2 py-1 text-lg text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default SummarizeNoteModal;
