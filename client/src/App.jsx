import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import AttendanceHistory from './pages/AttendanceHistory';
import SubmitForm from './pages/SubmitForm';
import AdminPanel from './pages/AdminPanel';
import TeacherDashboard from './pages/TeacherDashboard';
import OfferedCourses from './pages/OfferedCourses';
import StudentList from './pages/StudentList';
import GiveAttendance from './pages/GiveAttendance';
import GiveMarks from './pages/GiveMarks';
import UserList from './pages/UserList';
import AddUser from './pages/AddUser';
import DeleteUser from './pages/DeleteUser';
import AddDepartment from './pages/AddDepartment';
import AddCourses from './pages/AddCourses';
import AddNotice from './pages/AddNotice';
import FormFillUp from './pages/FormFillUp';
import AddTeacherDetails from './pages/AddTeacherDetails';
import AddStudentDetails from './pages/AddStudentDetails';
import TeacherStatus from './pages/TeacherStatus';
import StudentStatus from './pages/StudentStatus';
import MyDetails from './pages/MyDetails';
import AssignedCourses from './pages/AssignedCourses';
import Notices from './pages/Notices';
import StudentDetails from './pages/StudentDetails';
import TeacherNotices from './pages/TeacherNotices';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/attendance-history" element={<AttendanceHistory />} />
                <Route path="/submit-form" element={<SubmitForm />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/admin-panel/user-list" element={<UserList />} />
                <Route path="/admin-panel/add-user" element={<AddUser />} />
                <Route path="/admin-panel/delete-user" element={<DeleteUser />} />
                <Route path="/admin-panel/add-department" element={<AddDepartment />} />
                <Route path="/admin-panel/add-courses" element={<AddCourses />} />
                <Route path="/admin-panel/add-notice" element={<AddNotice />} />
                <Route path="/admin-panel/form-fill-up" element={<FormFillUp />} />
                <Route path="/teachers/dashboard" element={<TeacherDashboard />} />
                <Route path="/teachers/offered-courses" element={<OfferedCourses />} />
                <Route path="/teachers/student-list" element={<StudentList />} />
                <Route path="/teachers/give-attendance" element={<GiveAttendance />} />
                <Route path="/teachers/give-marks" element={<GiveMarks />} />
                <Route path="/admin-panel/add-teachers-details" element={<AddTeacherDetails />} />
                <Route path="/admin-panel/add-students-details" element={<AddStudentDetails />} />
                <Route path="/admin-panel/teacher-status" element={<TeacherStatus />} />
                <Route path="/admin-panel/student-status" element={<StudentStatus />} />
                <Route path="/teachers/my-details" element={<MyDetails />} />
                <Route path="/students/assigned-courses" element={<AssignedCourses />} />
                <Route path="/students/notices" element={<Notices />} />
                <Route path="/students/student-details" element={<StudentDetails />} />
                <Route path="/students/submit-form" element={<SubmitForm />} />
                <Route path="/teachers/notices" element={<TeacherNotices />} />
            </Routes>
        </Router>
    );
}

export default App;