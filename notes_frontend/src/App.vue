<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <h1 class="brand">Notes App</h1>
    <nav class="nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/notes">Notes</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <section class="content">
    <RouterView />
  </section>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1rem;
}
.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
}
.nav a {
  display: inline-block;
  padding: 0 .5rem;
  border-left: 1px solid var(--color-border);
}
.nav a:first-of-type {
  border: 0;
}
.content {
  grid-column: 1 / -1;
}
</style>
