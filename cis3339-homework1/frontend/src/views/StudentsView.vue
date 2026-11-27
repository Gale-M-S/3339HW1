<script setup>
import { onMounted, ref } from 'vue';
import { useCampusStore } from '../stores/campus';
import Feedback from '../components/Feedback.vue';

const campus = useCampusStore();
const form = ref({ name: '', id: '', phone: '', zip: '' });
const search = ref('');
onMounted(() => campus.loadStudents());

async function addStudent() {
  if (await campus.addStudent({ ...form.value })) {
    form.value = { name: '', id: '', phone: '', zip: '' };
    search.value = '';
  }
}

async function findStudents() {
  await campus.loadStudents(search.value.trim());
}

async function clearSearch() {
  search.value = '';
  await campus.loadStudents();
}

async function removeStudent(student) {
  if (!window.confirm(`Delete ${student.name}? Their enrollments will also be removed.`)) return;
  const removed = await campus.removeStudent(student._id);
  if (removed && search.value.trim()) await campus.loadStudents(search.value.trim());
}
</script>

<template>
  <div class="page-heading">
    <div><p class="eyebrow">CAMPUS DIRECTORY</p><h1>Students</h1><p class="subheading">Manage student records and contact details.</p></div>
    <span class="count-pill">{{ campus.students.length }} records</span>
  </div>
  <Feedback :loading="campus.loading" :error="campus.error" :notice="campus.notice" />

  <div class="two-column">
    <section class="card form-card">
      <div class="card-heading"><span class="icon-box green">＋</span><div><h2>Add a student</h2><p>Create a student record</p></div></div>
      <form class="stack-form" @submit.prevent="addStudent">
        <label>Full name<input v-model.trim="form.name" required maxlength="100" placeholder="e.g. Jordan Lee" /></label>
        <label>Student ID<input v-model.trim="form.id" required maxlength="30" placeholder="e.g. 1001" /></label>
        <div class="form-row">
          <label>Phone number<input v-model.trim="form.phone" required maxlength="30" placeholder="555-123-4567" /></label>
          <label>ZIP code<input v-model.trim="form.zip" required maxlength="12" placeholder="77001" /></label>
        </div>
        <button class="button primary" :disabled="campus.loading">{{ campus.loading ? 'Saving…' : 'Add student' }} <span>→</span></button>
      </form>
    </section>

    <section class="card directory-card">
      <div class="card-heading"><span class="icon-box blue">⌕</span><div><h2>Student directory</h2><p>Search by name</p></div></div>
      <form class="search-form" @submit.prevent="findStudents"><label class="sr-only" for="student-search">Search students by name</label><input id="student-search" v-model="search" placeholder="Type a student's name…" /><button class="button dark" :disabled="campus.loading">Search</button><button v-if="search" type="button" class="button subtle" :disabled="campus.loading" @click="clearSearch">Clear</button></form>
      <div class="table-wrap"><table><thead><tr><th>STUDENT</th><th>ID</th><th>PHONE</th><th>ZIP</th><th><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
          <tr v-for="student in campus.students" :key="student._id"><td><strong>{{ student.name }}</strong></td><td>{{ student.id }}</td><td>{{ student.phone }}</td><td>{{ student.zip }}</td><td><button class="text-button danger-text" :disabled="campus.loading" @click="removeStudent(student)" :aria-label="`Delete ${student.name}`">Delete</button></td></tr>
          <tr v-if="!campus.students.length"><td colspan="5" class="empty-state">{{ search ? 'No students match that name.' : 'No student records yet. Add one to get started.' }}</td></tr>
        </tbody>
      </table></div>
    </section>
  </div>
</template>
