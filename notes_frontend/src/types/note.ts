//
// Note-related TypeScript types for the Notes application.
//

/**
 * Represents a Note entity returned by the backend.
 */
export interface Note {
  /** Unique identifier of the note. */
  id: string | number
  /** Title of the note. */
  title: string
  /** Body/content of the note. */
  content: string
  /** ISO-8601 timestamp of creation time. */
  createdAt: string
  /** ISO-8601 timestamp of last update time. */
  updatedAt: string
}

/**
 * Payload used when creating a new note.
 * Only the fields that the backend expects for creation are included.
 */
export interface NewNote {
  /** Title of the new note. */
  title: string
  /** Body/content of the new note. */
  content: string
}

/**
 * Payload used when updating an existing note.
 * Partial fields to allow patch-like updates via PUT.
 */
export interface UpdateNote {
  /** New title for the note. Optional. */
  title?: string
  /** New body/content for the note. Optional. */
  content?: string
}
