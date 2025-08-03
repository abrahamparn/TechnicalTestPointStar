import { useEffect } from "react";
import { useSummarizeNote } from "../api";

const SummarizeNoteModal = ({ isOpen, onClose, noteToSummarize }) => {
  const { mutate, data, isPending, isSuccess, isError, error, reset } = useSummarizeNote();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleGenerateSummary = () => {
    if (noteToSummarize) {
      mutate(noteToSummarize.note_id);
    }
  };

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
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">AI-Powered Summary</h2>
        <div className="p-4 border rounded-md bg-gray-50 min-h-[200px]">
          {/* Default state: show the button */}
          {!isPending && !isSuccess && !isError && (
            <div className="text-center flex flex-col items-center justify-center h-full">
              <p className="mb-4">Click the button to generate a summary for this note.</p>
              <button
                onClick={handleGenerateSummary}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Generate Summary
              </button>
            </div>
          )}

          {/* Loading state */}
          {isPending && <p>🧠 Generating summary, please wait...</p>}

          {/* Success state */}
          {isSuccess && (
            <div>
              <h3 className="font-semibold mb-2">Summary:</h3>
              <p className="whitespace-pre-wrap">{data.summary}</p>
            </div>
          )}

          {/* Error state */}
          {isError && <p className="text-red-600">Error: {error.message}</p>}
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
