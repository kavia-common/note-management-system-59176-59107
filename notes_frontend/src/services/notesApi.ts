import http from './http'
import type { Note, NewNote, UpdateNote } from '@/types/note'

const BASE_PATH = '/api/notes'

/**
 * Service layer for interacting with the Notes backend API.
 * Uses the shared `http` client which handles base URL, JSON, and errors.
 */
export const notesApi = {
  // PUBLIC_INTERFACE
  listNotes(): Promise<Note[]> {
    /** Fetch a list of notes. */
    return http.get<Note[]>(BASE_PATH)
  },

  // PUBLIC_INTERFACE
  getNote(id: string | number): Promise<Note> {
    /** Fetch a single note by id. */
    return http.get<Note>(`${BASE_PATH}/${encodeURIComponent(String(id))}`)
  },

  // PUBLIC_INTERFACE
  createNote(payload: NewNote): Promise<Note> {
    /** Create a new note with the provided payload. */
    return http.post<Note>(BASE_PATH, payload)
  },

  // PUBLIC_INTERFACE
  updateNote(id: string | number, payload: UpdateNote): Promise<Note> {
    /** Update an existing note by id with the provided payload. */
    return http.put<Note>(`${BASE_PATH}/${encodeURIComponent(String(id))}`, payload)
  },

  // PUBLIC_INTERFACE
  deleteNote(id: string | number): Promise<{ success: boolean } | void> {
    /**
     * Delete a note by id.
     * Returns either a success payload from the server or void if server responds with empty body.
     */
    return http.del<{ success: boolean } | void>(`${BASE_PATH}/${encodeURIComponent(String(id))}`)
  },
}

export default notesApi
