import { useEffect } from "react";

const EditNoteModal = ({ isOpen, onClose, children }) => {
  // logic on closing and opening modal
  useEffect(() => {
    // Disable body scroll when the modal is open
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}

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

export default EditNoteModal;
