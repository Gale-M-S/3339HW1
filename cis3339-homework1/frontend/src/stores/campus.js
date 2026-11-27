import { defineStore } from 'pinia';

let nextId = 1;

export const useCampusStore = defineStore('campus', {
  state: () => ({
    students: [],
    courses: [],
    enrollments: [],
    error: '',
    notice: '',
  }),
  actions: {
    clearFeedback() {
      this.error = '';
      this.notice = '';
    },
    addStudent(student) {
      this.clearFeedback();
      if (this.students.some((item) => item.id.toLowerCase() === student.id.toLowerCase())) {
        this.error = 'A student with that ID already exists.';
        return false;
      }
      this.students.push({ ...student, _id: `student-${nextId++}` });
      this.notice = 'Student added.';
      return true;
    },
    removeStudent(id) {
      const student = this.students.find((item) => item._id === id);
      this.students = this.students.filter((item) => item._id !== id);
      this.enrollments = this.enrollments.filter((item) => item.studentId !== id);
      this.notice = student ? `${student.name} was removed.` : '';
    },
    addCourse(course) {
      this.clearFeedback();
      if (this.courses.some((item) => item.courseId.toLowerCase() === course.courseId.toLowerCase())) {
        this.error = 'A course with that ID already exists.';
        return false;
      }
      this.courses.push({ ...course, _id: `course-${nextId++}` });
      this.notice = 'Course added.';
      return true;
    },
    removeCourse(id) {
      const course = this.courses.find((item) => item._id === id);
      this.courses = this.courses.filter((item) => item._id !== id);
      this.enrollments = this.enrollments.filter((item) => item.courseId !== id);
      this.notice = course ? `${course.courseId} was removed.` : '';
    },
    addEnrollment(studentId, courseId) {
      this.clearFeedback();
      const duplicate = this.enrollments.some((item) => item.studentId === studentId && item.courseId === courseId);
      if (duplicate) {
        this.error = 'This student is already enrolled in that course.';
        return false;
      }
      this.enrollments.push({ _id: `enrollment-${nextId++}`, studentId, courseId });
      this.notice = 'Enrollment created.';
      return true;
    },
  },
});
