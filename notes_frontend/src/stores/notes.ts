import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Note, NewNote, UpdateNote } from '@/types/note'
import { notesApi } from '@/services/notesApi'

/**
 * Pinia store for Notes.
 * Manages notes list, selected note, loading flags, and error states.
 * Provides actions to interact with backend via notesApi.
 */
export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<Note[]>([])
  const selectedNote = ref<Note | null>(null)

  // Loading flags
  const isLoadingList = ref(false)
  const isLoadingOne = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)

  // Error state (string message for simplicity)
  const error = ref<string | null>(null)

  // Getters
  const hasError = computed(() => error.value !== null)
  const isBusy = computed(
    () => isLoadingList.value || isLoadingOne.value || isCreating.value || isUpdating.value || isDeleting.value
  )
  const notesCount = computed(() => notes.value.length)
  const getNoteById = (id: string | number) => computed(() => notes.value.find((n) => String(n.id) === String(id)) || null)

  // Helpers
  function setError(e: unknown) {
    // Convert various error shapes to a readable string
    if (typeof e === 'string') {
      error.value = e
      return
    }
    if (e && typeof e === 'object') {
      // Safely inspect common fields without using `any`
      const obj = e as Record<string, unknown>
      const hasMessage = typeof obj.message === 'string'
      const status = typeof obj.status === 'number' || typeof obj.status === 'string' ? String(obj.status) : ''
      const statusText = typeof obj.statusText === 'string' ? obj.statusText : ''
      const maybeMessage = hasMessage ? (obj.message as string) : (status || statusText ? `${status} ${statusText}`.trim() : null)
      error.value = String(maybeMessage || 'Unexpected error')
      return
    }
    error.value = 'Unexpected error'
  }

  // Actions

  // PUBLIC_INTERFACE
  async function fetchNotes(): Promise<void> {
    /** Fetch the list of notes and update the state. */
    isLoadingList.value = true
    error.value = null
    try {
      const data = await notesApi.listNotes()
      notes.value = data
    } catch (e) {
      setError(e)
      throw e
    } finally {
      isLoadingList.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function fetchNote(id: string | number): Promise<Note> {
    /** Fetch a single note by id; updates selectedNote and keeps list in sync if present. */
    isLoadingOne.value = true
    error.value = null
    try {
      const n = await notesApi.getNote(id)
      selectedNote.value = n

      // sync into list (replace if exists, else push)
      const idx = notes.value.findIndex((x) => String(x.id) === String(n.id))
      if (idx >= 0) notes.value[idx] = n
      else notes.value.push(n)

      return n
    } catch (e) {
      setError(e)
      throw e
    } finally {
      isLoadingOne.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function addNote(payload: NewNote): Promise<Note> {
    /** Create a new note and append to the list; also set as selected. */
    isCreating.value = true
    error.value = null
    try {
      const created = await notesApi.createNote(payload)
      notes.value.unshift(created)
      selectedNote.value = created
      return created
    } catch (e) {
      setError(e)
      throw e
    } finally {
      isCreating.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function editNote(id: string | number, payload: UpdateNote): Promise<Note> {
    /** Update an existing note and reflect the changes in list/selectedNote. */
    isUpdating.value = true
    error.value = null
    try {
      const updated = await notesApi.updateNote(id, payload)
      const idx = notes.value.findIndex((x) => String(x.id) === String(updated.id))
      if (idx >= 0) notes.value[idx] = updated
      if (selectedNote.value && String(selectedNote.value.id) === String(updated.id)) {
        selectedNote.value = updated
      }
      return updated
    } catch (e) {
      setError(e)
      throw e
    } finally {
      isUpdating.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function removeNote(id: string | number): Promise<void> {
    /** Delete a note by id and remove it from list; clear selected if it matches. */
    isDeleting.value = true
    error.value = null
    try {
      await notesApi.deleteNote(id)
      notes.value = notes.value.filter((n) => String(n.id) !== String(id))
      if (selectedNote.value && String(selectedNote.value.id) === String(id)) {
        selectedNote.value = null
      }
    } catch (e) {
      setError(e)
      throw e
    } finally {
      isDeleting.value = false
    }
  }

  return {
    // state
    notes,
    selectedNote,
    isLoadingList,
    isLoadingOne,
    isCreating,
    isUpdating,
    isDeleting,
    error,

    // getters
    hasError,
    isBusy,
    notesCount,
    getNoteById,

    // actions
    fetchNotes,
    fetchNote,
    addNote,
    editNote,
    removeNote,
  }
})
