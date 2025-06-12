import { FaHome, FaSignOutAlt, FaHistory, FaFileAlt, FaUserShield, FaChalkboardTeacher, FaList, FaBookOpen, FaCheckSquare, FaPen, FaUsers, FaPlus, FaTrash, FaBuilding, FaClipboardList, FaBell, FaClipboardCheck, FaUserGraduate } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;
    const isAdmin = userRole === 'admin';
    const isTeacher = userRole === 'teacher';
    const isStudent = userRole === 'student';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isAdminRoute = location.pathname.startsWith('/admin-panel');
    const isTeacherRoute = location.pathname.startsWith('/teachers/');
    const isStudentRoute = location.pathname.startsWith('/students/');

    return (
        <div className="w-64 h-screen bg-blue-900 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-blue-700">
                University Portal
            </div>
            <nav className="flex-1">
                {!isAdminRoute && !isTeacherRoute && !isStudentRoute && (
                    <>
                        <Link
                            to="/dashboard"
                            className={`flex items-center p-4 ${location.pathname === '/dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaHome className="mr-3" /> Dashboard
                        </Link>
                        <Link
                            to="/attendance-history"
                            className={`flex items-center p-4 ${location.pathname === '/attendance-history' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaHistory className="mr-3" /> Attendance History
                        </Link>
                        <Link
                            to="/submit-form"
                            className={`flex items-center p-4 ${location.pathname === '/submit-form' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaFileAlt className="mr-3" /> Submit Form
                        </Link>
                    </>
                )}
                {isAdmin && isAdminRoute && (
                    <>
                        <Link
                            to="/admin-panel"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaUserShield className="mr-3" /> Admin Dashboard
                        </Link>
                        <Link
                            to="/admin-panel/user-list"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/user-list' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaUsers className="mr-3" /> User List
                        </Link>
                        <Link
                            to="/admin-panel/add-user"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-user' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaPlus className="mr-3" /> Add User
                        </Link>
                        <Link
                            to="/admin-panel/delete-user"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/delete-user' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaTrash className="mr-3" /> Delete User
                        </Link>
                        <Link
                            to="/admin-panel/add-department"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-department' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaBuilding className="mr-3" /> Add Department
                        </Link>
                        <Link
                            to="/admin-panel/add-courses"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-courses' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaBookOpen className="mr-3" /> Add Courses
                        </Link>
                        <Link
                            to="/admin-panel/add-teachers-details"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-teachers-details' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaChalkboardTeacher className="mr-3" /> Add Teachers Details
                        </Link>
                        <Link
                            to="/admin-panel/add-students-details"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-students-details' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaUsers className="mr-3" /> Add Student Details
                        </Link>
                        <Link
                            to="/admin-panel/teacher-status"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/teacher-status' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaClipboardCheck className="mr-3" /> Teacher Status
                        </Link>
                        <Link
                            to="/admin-panel/student-status"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/student-status' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaUserGraduate className="mr-3" /> Student Status
                        </Link>
                        <Link
                            to="/admin-panel/add-notice"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-notice' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaBell className="mr-3" /> Add Notice
                        </Link>
                        <Link
                            to="/admin-panel/form-fill-up"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/form-fill-up' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaClipboardList className="mr-3" /> Form Fill-up
                        </Link>
                    </>
                )}
                {isTeacher && isTeacherRoute && (
                    <>
                        <Link
                            to="/teachers/dashboard"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaChalkboardTeacher className="mr-3" /> Teacher Dashboard
                        </Link>
                        <Link
                            to="/teachers/offered-courses"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/offered-courses' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaBookOpen className="mr-3" /> Offered Courses
                        </Link>
                        <Link
                            to="/teachers/student-list"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/student-list' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaList className="mr-3" /> Student List
                        </Link>
                        <Link
                            to="/teachers/give-attendance"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/give-attendance' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaCheckSquare className="mr-3" /> Give Attendance
                        </Link>
                        <Link
                            to="/teachers/give-marks"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/give-marks' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaPen className="mr-3" /> Give Marks
                        </Link>
                    </>
                )}
                {isStudent && isStudentRoute && (
                    <>
                        <Link
                            to="/students/dashboard"
                            className={`flex items-center p-4 ${location.pathname === '/students/dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaUserGraduate className="mr-3" /> Student Dashboard
                        </Link>
                        <Link
                            to="/students/attendance-history"
                            className={`flex items-center p-4 ${location.pathname === '/students/attendance-history' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaHistory className="mr-3" /> Attendance History
                        </Link>
                    </>
                )}
            </nav>
            <button
                onClick={handleLogout}
                className="flex items-center p-4 border-t border-blue-700 hover:bg-blue-700 transition-all duration-300"
            >
                <FaSignOutAlt className="mr-3" /> Logout
            </button>
        </div>
    );
};

export default Sidebar;