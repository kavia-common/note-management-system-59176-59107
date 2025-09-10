<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'

const route = useRoute()
const router = useRouter()
const store = useNotesStore()

const id = computed(() => route.params.id as string)

const noteFromList = computed(() => store.getNoteById(id.value).value)
const note = computed(() => noteFromList.value || store.selectedNote)

const isLoading = computed(() => store.isLoadingOne)
const isDeleting = computed(() => store.isDeleting)
const hasError = computed(() => store.hasError)
const errorMsg = computed(() => store.error)

async function load() {
  try {
    await store.fetchNote(id.value)
  } catch {
    // handled via store
  }
}

onMounted(load)
watch(id, load)

function goToEdit() {
  router.push({ name: 'note-edit', params: { id: id.value } })
}
async function onDelete() {
  if (!id.value) return
  if (!confirm('Delete this note?')) return
  try {
    await store.removeNote(id.value)
    router.push({ name: 'notes' })
  } catch { /* handled in store */ }
}
</script>

<template>
  <main>
    <header class="page-header">
      <h1>Note Details</h1>
      <div class="actions">
        <button class="btn" @click="router.push({ name: 'notes' })">Back</button>
        <button class="btn" @click="goToEdit">Edit</button>
        <button class="btn btn-danger" :disabled="isDeleting" @click="onDelete">
          {{ isDeleting ? 'Deleting…' : 'Delete' }}
        </button>
      </div>
    </header>

    <section v-if="isLoading" class="placeholder">
      <!-- Placeholder for Loading component -->
      <p>Loading note…</p>
    </section>

    <section v-else-if="hasError" class="placeholder error">
      <p>Error: {{ errorMsg }}</p>
      <button class="btn" @click="load">Retry</button>
    </section>

    <section v-else-if="!note">
      <p class="placeholder">Note not found.</p>
    </section>

    <section v-else class="note">
      <h2 class="title">{{ note.title }}</h2>
      <div class="meta">
        <small>Created: {{ new Date(note.createdAt).toLocaleString() }}</small>
        <small>Updated: {{ new Date(note.updatedAt).toLocaleString() }}</small>
      </div>
      <pre class="content">{{ note.content }}</pre>
    </section>
  </main>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.actions {
  display: flex;
  gap: .5rem;
}
.placeholder {
  padding: 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}
.placeholder.error {
  border-color: #b00020;
  color: #b00020;
}
.note .title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: .35rem;
}
.meta {
  display: flex;
  gap: 1rem;
  color: var(--vt-c-text-light-2);
  margin-bottom: .75rem;
}
.content {
  white-space: pre-wrap;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}
.btn {
  padding: .45rem .8rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
}
.btn-danger {
  color: #b00020;
  border-color: #b00020;
  background: transparent;
}
.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}
</style>
