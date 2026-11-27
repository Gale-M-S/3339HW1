import { defineStore } from 'pinia';

async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'The request could not be completed.');
  return body;
}

export const useCampusStore = defineStore('campus', {
  state: () => ({
    students: [],
    courses: [],
    enrollments: [],
    pendingRequests: 0,
    error: '',
    notice: '',
  }),
  getters: {
    loading: (state) => state.pendingRequests > 0,
  },
  actions: {
    clearFeedback() {
      this.error = '';
      this.notice = '';
    },
    async run(action) {
      this.clearFeedback();
      this.pendingRequests += 1;
      try {
        return await action();
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.pendingRequests -= 1;
      }
    },
    async loadStudents(name = '') {
      return this.run(async () => {
        const query = name ? `?name=${encodeURIComponent(name)}` : '';
        this.students = await request(`/students${query}`);
      });
    },
    async addStudent(student) {
      return this.run(async () => {
        await request('/students', { method: 'POST', body: JSON.stringify(student) });
        this.students = await request('/students');
        this.notice = 'Student added.';
        return true;
      });
    },
    async removeStudent(id) {
      return this.run(async () => {
        await request(`/students/${id}`, { method: 'DELETE' });
        [this.students, this.enrollments] = await Promise.all([
          request('/students'),
          request('/enrollments'),
        ]);
        this.notice = 'Student and related enrollments removed.';
        return true;
      });
    },
    async loadCourses() {
      return this.run(async () => {
        this.courses = await request('/courses');
      });
    },
    async addCourse(course) {
      return this.run(async () => {
        await request('/courses', { method: 'POST', body: JSON.stringify(course) });
        this.courses = await request('/courses');
        this.notice = 'Course added.';
        return true;
      });
    },
    async removeCourse(id) {
      return this.run(async () => {
        await request(`/courses/${id}`, { method: 'DELETE' });
        [this.courses, this.enrollments] = await Promise.all([
          request('/courses'),
          request('/enrollments'),
        ]);
        this.notice = 'Course and related enrollments removed.';
        return true;
      });
    },
    async loadEnrollments(course = '') {
      return this.run(async () => {
        const query = course ? `?course=${encodeURIComponent(course)}` : '';
        this.enrollments = await request(`/enrollments${query}`);
      });
    },
    async addEnrollment({ studentId, courseId }) {
      return this.run(async () => {
        await request('/enrollments', {
          method: 'POST',
          body: JSON.stringify({ studentId, courseId }),
        });
        this.enrollments = await request('/enrollments');
        this.notice = 'Enrollment created.';
        return true;
      });
    },
  },
});
