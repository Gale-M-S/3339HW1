<script setup>
import { computed, ref } from 'vue';
import { useCampusStore } from '../stores/campus';
import Feedback from '../components/Feedback.vue';

const campus = useCampusStore();
const studentId = ref('');
const courseId = ref('');
const filterCourse = ref('');

const roster = computed(() => campus.enrollments
  .filter((item) => !filterCourse.value || item.courseId === filterCourse.value)
  .map((item) => ({
    ...item,
    student: campus.students.find((student) => student._id === item.studentId),
    course: campus.courses.find((course) => course._id === item.courseId),
  })));

function enroll() {
  campus.addEnrollment(studentId.value, courseId.value);
}
</script>

<template>
  <div class="page-heading">
    <div><p class="eyebrow">CLASS ROSTERS</p><h1>Enrollments</h1><p class="subheading">Connect students to courses and review rosters.</p></div>
    <span class="count-pill">{{ roster.length }} shown</span>
  </div>
  <Feedback :error="campus.error" :notice="campus.notice" />

  <div class="two-column">
    <section class="card form-card">
      <div class="card-heading"><span class="icon-box green">＋</span><div><h2>Enroll a student</h2><p>Choose from the records in this preview</p></div></div>
      <form class="stack-form" @submit.prevent="enroll">
        <label>Student<select v-model="studentId" required><option value="" disabled>Select a student</option><option v-for="student in campus.students" :key="student._id" :value="student._id">{{ student.name }} · {{ student.id }}</option></select></label>
        <label>Course<select v-model="courseId" required><option value="" disabled>Select a course</option><option v-for="course in campus.courses" :key="course._id" :value="course._id">{{ course.courseId }} · {{ course.name }}</option></select></label>
        <p v-if="!campus.students.length || !campus.courses.length" class="hint">Add at least one student and one course first.</p>
        <button class="button primary" :disabled="!campus.students.length || !campus.courses.length">Create enrollment <span>→</span></button>
      </form>
    </section>

    <section class="card directory-card">
      <div class="card-heading"><span class="icon-box blue">↗</span><div><h2>Course roster</h2><p>Students enrolled in a course</p></div></div>
      <div class="search-form"><label class="sr-only" for="roster-course">Filter by course</label><select id="roster-course" v-model="filterCourse"><option value="">All courses</option><option v-for="course in campus.courses" :key="course._id" :value="course._id">{{ course.courseId }} — {{ course.name }}</option></select></div>
      <div class="table-wrap"><table><thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>COURSE</th></tr></thead>
        <tbody>
          <tr v-for="item in roster" :key="item._id"><td><strong>{{ item.student?.name }}</strong></td><td>{{ item.student?.id }}</td><td><span class="code-pill">{{ item.course?.courseId }}</span> {{ item.course?.name }}</td></tr>
          <tr v-if="!roster.length"><td colspan="3" class="empty-state">No enrollments to show. Create one to see the roster.</td></tr>
        </tbody>
      </table></div>
    </section>
  </div>
</template>
