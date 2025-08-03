import NotesList from "../features/notes/components/NotesList";
import CreateNoteForm from "../features/notes/components/CreateNoteForm"; // Import the form
import { useState } from "react";
import EditNoteModal from "../features/notes/components/EditNoteModal";
import EditNoteForm from "../features/notes/components/EditNoteForm";
import { useLogout } from "../features/auth/api";
import SummarizeNoteModal from "../features/notes/components/SummarizeNoteModal";
import { confirm } from "../lib/confirm.js";

const DashboardPage = () => {
  const [editingNote, setEditingNote] = useState(null);
  const [sumarizeNote, setSummarizing] = useState(null);

  const { mutate: doLogout, isPending } = useLogout();

  const handleLogOut = async () => {
    const ok = await confirm("Log out?", "You will be signed out from this device.");
    if (!ok) return;
    try {
      await doLogout(); // your hook already handles toasts + navigate on success/error
    } catch (_) {
      // no-op: useLogout onError already shows a toast and handles navigation for 401/419
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-row justify-between ">
        <h1 className="text-3xl font-bold mb-6">My Notes</h1>
        <button
          onClick={handleLogOut}
          disabled={isPending}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 h-[30%] flex"
        >
          {isPending ? "Logging out..." : "Log out"}
        </button>
      </div>
      <CreateNoteForm /> {/* Add the form here */}
      <NotesList onEditNote={setEditingNote} onSummarize={setSummarizing} />{" "}
      {/* Pass the state setter down */}
      <EditNoteModal isOpen={!!editingNote} onClose={() => setEditingNote(null)}>
        <EditNoteForm noteToEdit={editingNote} onClose={() => setEditingNote(null)} />
      </EditNoteModal>
      <SummarizeNoteModal
        noteToSummarize={sumarizeNote}
        isOpen={!!sumarizeNote}
        onClose={() => setSummarizing(null)}
      />
    </div>
  );
};
export default DashboardPage;
