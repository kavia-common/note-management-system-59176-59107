<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Note } from '@/types/note'

const props = defineProps<{
  note: Note
  deleting?: boolean
}>()

const emit = defineEmits<{
  (e: 'delete', id: string | number): void
}>()

const router = useRouter()
const formattedUpdatedAt = computed(() => {
  const d = new Date(props.note.updatedAt)
  return isNaN(d.getTime()) ? props.note.updatedAt : d.toLocaleString()
})

function goToDetail() {
  router.push({ name: 'note-detail', params: { id: props.note.id } })
}
function goToEdit() {
  router.push({ name: 'note-edit', params: { id: props.note.id } })
}
function onDelete() {
  if (confirm('Delete this note?')) {
    emit('delete', props.note.id)
  }
}
</script>

<template>
  <article class="note-card">
    <header class="note-card__header" @click="goToDetail">
      <h3 class="note-card__title">{{ note.title }}</h3>
    </header>
    <section class="note-card__content" @click="goToDetail">
      <p class="note-card__preview">
        {{ note.content?.slice(0, 160) }}<span v-if="note.content && note.content.length > 160">…</span>
      </p>
    </section>
    <footer class="note-card__footer">
      <small class="note-card__meta">Updated: {{ formattedUpdatedAt }}</small>
      <div class="note-card__actions">
        <button class="btn" @click.prevent="goToDetail">View</button>
        <button class="btn" @click.prevent="goToEdit">Edit</button>
        <button class="btn btn-danger" :disabled="deleting" @click.prevent="onDelete">
          {{ deleting ? 'Deleting…' : 'Delete' }}
        </button>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.note-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  display: grid;
  gap: 0.5rem;
  background: var(--color-background);
}
.note-card__header {
  cursor: pointer;
}
.note-card__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
}
.note-card__content {
  cursor: pointer;
  color: var(--color-text);
}
.note-card__meta {
  color: var(--vt-c-text-light-2);
}
.note-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
}
.note-card__actions {
  display: flex;
  gap: .5rem;
}
.btn {
  padding: .35rem .6rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
}
.btn:hover {
  border-color: var(--color-border-hover);
}
.btn-danger {
  color: #b00020;
  border-color: #b00020;
  background: transparent;
}
.btn-danger:disabled {
  opacity: .6;
  cursor: not-allowed;
}
</style>
