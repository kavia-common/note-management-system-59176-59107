<script setup lang="ts">
defineProps<{
  /**
   * Optional text to show beside the spinner.
   * Defaults to "Loading…".
   */
  label?: string
}>()
</script>

<template>
  <div class="loading">
    <span class="spinner" aria-hidden="true"></span>
    <span class="sr-only">Loading</span>
    <span class="label">{{ label ?? 'Loading…' }}</span>
  </div>
</template>

<style scoped>
.loading {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: hsla(160, 100%, 37%, 1);
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;
}

.label {
  color: var(--color-text);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
  border: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
