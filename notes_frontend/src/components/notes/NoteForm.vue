<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { Note, NewNote, UpdateNote } from '@/types/note'

const props = defineProps<{
  /** If provided, form is in edit mode using this note's values */
  model?: Note | null
  /** Loading flag for submit button */
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: NewNote | UpdateNote): void
  (e: 'cancel'): void
}>()

const form = reactive({
  title: '',
  content: '',
})

const isEdit = computed(() => !!props.model)
watch(
  () => props.model,
  (m) => {
    form.title = m?.title ?? ''
    form.content = m?.content ?? ''
  },
  { immediate: true }
)

const isValid = computed(() => form.title.trim().length > 0 && form.content.trim().length > 0)

function onSubmit(e: Event) {
  e.preventDefault()
  if (!isValid.value) return
  const payload: NewNote | UpdateNote = {
    title: form.title.trim(),
    content: form.content.trim(),
  }
  emit('submit', payload)
}
</script>

<template>
  <form class="note-form" @submit="onSubmit">
    <div class="field">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="form.title"
        placeholder="Note title"
        type="text"
        required
      />
    </div>

    <div class="field">
      <label for="content">Content</label>
      <textarea
        id="content"
        v-model="form.content"
        placeholder="Write your note…"
        rows="8"
        required
      />
    </div>

    <div class="form-actions">
      <button class="btn btn-primary" type="submit" :disabled="submitting || !isValid">
        {{ submitting ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save' : 'Create') }}
      </button>
      <button class="btn" type="button" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<style scoped>
.note-form {
  display: grid;
  gap: 1rem;
}
.field {
  display: grid;
  gap: .35rem;
}
label {
  font-weight: 600;
}
input, textarea {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: .6rem .75rem;
  background: var(--color-background);
  color: var(--color-text);
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-border-hover);
}
.form-actions {
  display: flex;
  gap: .5rem;
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
.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}
</style>
