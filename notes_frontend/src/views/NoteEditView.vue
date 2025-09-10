<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NoteForm from '@/components/notes/NoteForm.vue'
import { useNotesStore } from '@/stores/notes'
import type { NewNote, UpdateNote } from '@/types/note'

const route = useRoute()
const router = useRouter()
const store = useNotesStore()

const id = computed(() => route.params.id as string | undefined)
const isCreate = computed(() => route.name === 'note-new' || !id.value)

const model = computed(() => (id.value ? store.getNoteById(id.value).value || store.selectedNote : null))

const loadingOne = computed(() => store.isLoadingOne)
const submitting = computed(() => (isCreate.value ? store.isCreating : store.isUpdating))
const hasError = computed(() => store.hasError)
const errorMsg = computed(() => store.error)

async function ensureLoaded() {
  if (!id.value) return
  try {
    await store.fetchNote(id.value)
  } catch {
    // handled via store error
  }
}
onMounted(ensureLoaded)
watch(id, ensureLoaded)

async function onSubmit(payload: NewNote | UpdateNote) {
  try {
    if (isCreate.value) {
      const created = await store.addNote(payload as NewNote)
      router.replace({ name: 'note-detail', params: { id: created.id } })
    } else if (id.value) {
      const updated = await store.editNote(id.value, payload as UpdateNote)
      router.replace({ name: 'note-detail', params: { id: updated.id } })
    }
  } catch {
    // store has error populated
  }
}
</script>

<template>
  <main>
    <header class="page-header">
      <h1>{{ isCreate ? 'New Note' : 'Edit Note' }}</h1>
      <button class="btn" @click="$router.back()">Back</button>
    </header>

    <section v-if="!isCreate && loadingOne" class="placeholder">
      <!-- Placeholder for Loading component -->
      <p>Loading note…</p>
    </section>

    <section v-else-if="hasError" class="placeholder error">
      <p>Error: {{ errorMsg }}</p>
      <button class="btn" v-if="!isCreate" @click="$router.push({ name: 'note-detail', params: { id } })">
        Back to detail
      </button>
    </section>

    <section v-else>
      <NoteForm
        :model="isCreate ? null : model || null"
        :submitting="submitting"
        @submit="onSubmit"
        @cancel="$router.back()"
      />
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
.placeholder {
  padding: 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}
.placeholder.error {
  border-color: #b00020;
  color: #b00020;
}
.btn {
  padding: .45rem .8rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
}
</style>
