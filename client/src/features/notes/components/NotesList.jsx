import { useNotes } from "../api";
import NoteCard from "./NoteCard";
import { useMemo, useState } from "react";

const NotesList = ({ onEditNote, onSummarize }) => {
  const { data: notes, isLoading, isError, error } = useNotes();
  const [query, setQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => (n.title || "").toLowerCase().includes(q));
  }, [notes, query]);

  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  if (isError) {
    return <p>Error fetching notes: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Implementation of searcing for the title */}
      <div>
        <input
          className="w-full bg-amber-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          placeholder="Search for title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={onEditNote} onSummarize={onSummarize} />
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-sm text-gray-500">No notes match your search.</p>
        )}
      </div>
    </div>
  );
};
export default NotesList;
