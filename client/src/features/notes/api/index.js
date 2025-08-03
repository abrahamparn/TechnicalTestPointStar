import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api";

// Fetch All Notes
const fetchNotes = async () => {
  const { data } = await apiClient.get("/note");
  console.log("data", data);
  // returns { success: true, notes: [...] }.
  return data.notes;
};

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });
};

//Create new note
const createNote = async (newNote) => {
  const { data } = await apiClient.post("/note", newNote);
  return data;
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

const deleteNote = async (noteId) => {
  await apiClient.delete(`/note/${noteId}`);
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

const editNote = async ({ noteId, data }) => {
  const response = await apiClient.patch(`/note/${noteId}`, data);
  return response.data;
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

// All for the AI
const summarizeNote = async (noteId) => {
  const { data } = await apiClient.get(`/note/${noteId}/summarize`);
  console.log("data", data);
  return data;
};

export const useSummarizeNote = () => {
  return useMutation({
    mutationFn: summarizeNote,
  });
};
