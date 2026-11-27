<script setup>
import { ref } from 'vue';
import { useCampusStore } from '../stores/campus';
import Feedback from '../components/Feedback.vue';

const campus = useCampusStore();
const form = ref({ courseId: '', name: '' });

function addCourse() {
  if (campus.addCourse({ ...form.value })) form.value = { courseId: '', name: '' };
}

function removeCourse(course) {
  if (window.confirm(`Delete ${course.courseId}? Its enrollments will also be removed.`)) campus.removeCourse(course._id);
}
</script>

<template>
  <div class="page-heading">
    <div><p class="eyebrow">ACADEMIC CATALOG</p><h1>Courses</h1><p class="subheading">Keep the course catalog up to date.</p></div>
    <span class="count-pill">{{ campus.courses.length }} courses</span>
  </div>
  <Feedback :error="campus.error" :notice="campus.notice" />

  <div class="two-column">
    <section class="card form-card">
      <div class="card-heading"><span class="icon-box green">＋</span><div><h2>Add a course</h2><p>Add a course to the catalog</p></div></div>
      <form class="stack-form" @submit.prevent="addCourse">
        <label>Course ID<input v-model.trim="form.courseId" required maxlength="30" placeholder="e.g. CIS 3339" /></label>
        <label>Course name<input v-model.trim="form.name" required maxlength="120" placeholder="Enterprise Applications Development" /></label>
        <button class="button primary">Add course <span>→</span></button>
      </form>
    </section>

    <section class="card directory-card">
      <div class="card-heading"><span class="icon-box violet">▤</span><div><h2>Course catalog</h2><p>All current courses</p></div></div>
      <div class="table-wrap"><table><thead><tr><th>COURSE ID</th><th>COURSE NAME</th><th><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
          <tr v-for="course in campus.courses" :key="course._id"><td><span class="code-pill">{{ course.courseId }}</span></td><td><strong>{{ course.name }}</strong></td><td><button class="text-button danger-text" @click="removeCourse(course)" :aria-label="`Delete ${course.courseId}`">Delete</button></td></tr>
          <tr v-if="!campus.courses.length"><td colspan="3" class="empty-state">No courses yet. Add one to get started.</td></tr>
        </tbody>
      </table></div>
    </section>
  </div>
</template>
