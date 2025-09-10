import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // Notes routes
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesListView.vue'),
    },
    {
      path: '/notes/new',
      name: 'note-new',
      component: () => import('../views/NoteEditView.vue'),
    },
    {
      path: '/notes/:id',
      name: 'note-detail',
      component: () => import('../views/NoteDetailView.vue'),
      props: true,
    },
    {
      path: '/notes/:id/edit',
      name: 'note-edit',
      component: () => import('../views/NoteEditView.vue'),
      props: true,
    },
  ],
})

export default router
