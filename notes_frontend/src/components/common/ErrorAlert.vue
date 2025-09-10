<script setup lang="ts">
defineProps<{
  /**
   * Error message to display.
   */
  message: string | null | undefined
  /**
   * Optional action label (e.g., "Retry").
   */
  actionLabel?: string
}>()

const emit = defineEmits<{
  /**
   * Emitted when the action button is clicked, for example to retry.
   */
  (e: 'action'): void
}>()
</script>

<template>
  <div v-if="message" class="error" role="alert" aria-live="polite">
    <p class="msg">Error: {{ message }}</p>
    <button
      v-if="actionLabel"
      class="btn"
      type="button"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.error {
  padding: 1rem;
  border: 1px solid #b00020;
  color: #b00020;
  background: #ffebee0d;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: .75rem;
}
.msg {
  margin: 0;
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
</style>
