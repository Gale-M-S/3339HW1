const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cis3339_homework1';

app.use(express.json());
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  return next(error);
});

function sendError(error, res) {
  if (error.code === 11000) return res.status(409).json({ error: 'A record with that ID already exists.' });
  if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
  if (error.name === 'CastError') return res.status(400).json({ error: 'The requested record ID is invalid.' });
  console.error(error);
  return res.status(500).json({ error: 'The request could not be completed.' });
}

function escapedRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.get('/api/students', async (req, res) => {
  try {
    const name = String(req.query.name || '').trim();
    const filter = name ? { name: { $regex: escapedRegex(name), $options: 'i' } } : {};
    res.json(await Student.find(filter).sort({ name: 1 }));
  } catch (error) { sendError(error, res); }
});

app.post('/api/students', async (req, res) => {
  try {
    const body = req.body || {};
    const student = await Student.create({
      name: body.name,
      id: body.id,
      phone: body.phone,
      zip: body.zip,
    });
    res.status(201).json(student);
  } catch (error) { sendError(error, res); }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    await Enrollment.deleteMany({ student: student._id });
    res.json({ message: 'Student and related enrollments deleted.' });
  } catch (error) { sendError(error, res); }
});

app.get('/api/courses', async (_req, res) => {
  try { res.json(await Course.find().sort({ courseId: 1 })); }
  catch (error) { sendError(error, res); }
});

app.post('/api/courses', async (req, res) => {
  try {
    const body = req.body || {};
    const course = await Course.create({ courseId: body.courseId, name: body.name });
    res.status(201).json(course);
  } catch (error) { sendError(error, res); }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    await Enrollment.deleteMany({ course: course._id });
    res.json({ message: 'Course and related enrollments deleted.' });
  } catch (error) { sendError(error, res); }
});

app.get('/api/enrollments', async (req, res) => {
  try {
    const filter = req.query.course ? { course: req.query.course } : {};
    const enrollments = await Enrollment.find(filter)
      .populate('student')
      .populate('course')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) { sendError(error, res); }
});

app.post('/api/enrollments', async (req, res) => {
  try {
    const { studentId, courseId } = req.body || {};
    if (!studentId || !courseId) {
      return res.status(400).json({ error: 'Choose a student and a course.' });
    }

    const [student, course] = await Promise.all([
      Student.findById(studentId),
      Course.findById(courseId),
    ]);
    if (!student || !course) {
      return res.status(404).json({ error: 'The selected student or course was not found.' });
    }

    const enrollment = await Enrollment.create({ student: student._id, course: course._id });
    res.status(201).json(await enrollment.populate(['student', 'course']));
  } catch (error) { sendError(error, res); }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} /api${req.path} was not found.` });
});

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('/{*splat}', (req, res, next) => {
  res.sendFile(path.join(frontendDist, 'index.html'), (error) => error && next(error));
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} was not found.` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: 'The request could not be completed.' });
});

async function start() {
  await mongoose.connect(MONGODB_URI);
  await Promise.all([Student.init(), Course.init(), Enrollment.init()]);
  app.listen(PORT, () => console.log(`API ready at http://localhost:${PORT}`));
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Could not start the API:', error.message);
    process.exit(1);
  });
}

module.exports = app;
