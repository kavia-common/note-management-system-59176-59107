<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import NoteCard from '@/components/notes/NoteCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'

const router = useRouter()
const notesStore = useNotesStore()

const notes = computed(() => notesStore.notes)
const isLoading = computed(() => notesStore.isLoadingList)
const isDeleting = computed(() => notesStore.isDeleting)
const hasError = computed(() => notesStore.hasError)
const errorMsg = computed(() => notesStore.error)

onMounted(() => {
  if (!notes.value?.length) {
    notesStore.fetchNotes().catch(() => {
      // already handled in store
    })
  }
})

function goToNew() {
  router.push({ name: 'note-new' })
}

function onDelete(id: string | number) {
  notesStore.removeNote(id).catch(() => {})
}
</script>

<template>
  <main>
    <header class="page-header">
      <h1>Notes</h1>
      <button class="btn btn-primary" @click="goToNew">New Note</button>
    </header>

    <section v-if="isLoading">
      <LoadingSpinner label="Loading notes…" />
    </section>

    <section v-else-if="hasError">
      <ErrorAlert
        :message="errorMsg || 'Something went wrong'"
        action-label="Retry"
        @action="notesStore.fetchNotes()"
      />
    </section>

    <section v-else>
      <p v-if="!notes.length" class="placeholder">No notes yet. Create your first note!</p>
      <div v-else class="grid">
        <NoteCard
          v-for="n in notes"
          :key="String(n.id)"
          :note="n"
          :deleting="isDeleting"
          @delete="onDelete"
        />
      </div>
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
.grid {
  display: grid;
  gap: 1rem;
}
.placeholder {
  padding: 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}
.btn {
  padding: .45rem .8rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
}
.btn-primary {
  background: hsla(160, 100%, 37%, 1);
  color: white;
  border-color: hsla(160, 100%, 37%, 1);
}
</style>
