const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./DB/connection');
const sessionRoute = require('./routes/sessionRoute');
const termRoute = require('./routes/termRoute');
const levelRoute = require('./routes/levelRoute');
const userRoute = require('./routes/userRoute');
const profileRoute = require('./routes/profileRoute');
const teacherRoute = require('./routes/teacherRoute');
const klassRoute = require('./routes/klassRoute');
const studentRoute = require('./routes/studentRoute');
const subjectRoute = require('./routes/subjectRoute');
const timeTableRoute = require('./routes/timetableRoute');
const attendenceRoute = require('./routes/attendenceRoute');
const announcementRoute = require('./routes/announcementRoute');
const quizRoute = require('./routes/quizRoute');
const testRoute = require('./routes/testRoute');
const feeRoute = require('./routes/feeRoute');
const assessmentItemRoute = require('./routes/assessmentItemRoute');
const assessmentRoute = require('./routes/assessmentRoute');
const resultRoute = require('./routes/resultRoute');
const reportCardRoute = require('./routes/reportCardRoute');
const authRoute = require('./routes/authRoute');
const adminRoute = require("./routes/adminRoute");
const studentDashboardRoute = require("./routes/studentDashboardRoute");

const app = express();

// ✅ CONNECT DB
connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ BODY + COOKIE PARSERS
app.use(express.json());
app.use(cookieParser());

// ✅ ROUTES
app.use('/api/v1/session', sessionRoute);
app.use('/api/v1/term', termRoute);
app.use('/api/v1/level', levelRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/profile', profileRoute);
app.use('/api/v1/teacher', teacherRoute);
app.use('/api/v1/klass', klassRoute);
app.use('/api/v1/student', studentRoute);
app.use('/api/v1/subject', subjectRoute); 
app.use('/api/v1/tabletable', timeTableRoute);
app.use('/api/v1/attendence', attendenceRoute);
app.use('/api/v1/announcement', announcementRoute);
app.use('/api/v1/quiz', quizRoute);
app.use('/api/v1/test', testRoute);
app.use('/api/v1/fee', feeRoute);
app.use('/api/v1/assessmentItem', assessmentItemRoute);
app.use('/api/v1/assessment', assessmentRoute);
app.use('/api/v1/result', resultRoute);
app.use('/api/v1/reportCard', reportCardRoute);
app.use('/api/v1/auth', authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/student-dashboard", studentDashboardRoute);

// ✅ TEST ROUTES
app.get('/', (req, res) => {
  res.send('Hello, World');
});

app.listen(3001, () => {
  console.log('server running at http://localhost:3001/');
});
