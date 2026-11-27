<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const route = useRoute();
const pageName = computed(() => ({
  '/students': 'Students',
  '/courses': 'Courses',
  '/enrollments': 'Enrollments',
}[route.path] || 'CampusDesk'));
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink to="/students" class="brand">
        <span class="brand-mark">C</span>
        <span>CampusDesk<small>STUDENT SERVICES</small></span>
      </RouterLink>
      <p class="nav-label">WORKSPACE</p>
      <nav aria-label="Main navigation">
        <RouterLink to="/students"><span class="nav-icon">▦</span> Students</RouterLink>
        <RouterLink to="/courses"><span class="nav-icon">▤</span> Courses</RouterLink>
        <RouterLink to="/enrollments"><span class="nav-icon">↗</span> Enrollments</RouterLink>
      </nav>
      <div class="sidebar-footer"><span class="status-dot"></span> Frontend preview · demo data</div>
    </aside>

    <main class="main-area">
      <header class="topbar">
        <div class="breadcrumb">CampusDesk <span>/</span> <strong>{{ pageName }}</strong></div>
        <div class="avatar" aria-label="Campus administrator">CA</div>
      </header>
      <div class="content"><RouterView /></div>
      <footer class="footer">CAMPUSDESK <span>·</span> FRONTEND PREVIEW</footer>
    </main>
  </div>
</template>
