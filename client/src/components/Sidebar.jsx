import { FaHome, FaSignOutAlt, FaHistory, FaFileAlt, FaUserShield, FaChalkboardTeacher, FaList, FaBookOpen, FaCheckSquare, FaPen, FaUsers, FaPlus, FaTrash, FaBuilding, FaClipboardList, FaBell } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;
    const isAdmin = userRole === 'admin';
    const isTeacher = userRole === 'teacher';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isAdminRoute = location.pathname.startsWith('/admin-panel');
    const isTeacherRoute = location.pathname.startsWith('/teachers/');

    return (
        <div className="w-64 h-screen bg-blue-900 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-blue-700">
                University Portal
            </div>
            <nav className="flex-1">
                {!isAdminRoute && !isTeacherRoute && (
                    <>
                        <a
                            href="/dashboard"
                            className={`flex items-center p-4 ${location.pathname === '/dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaHome className="mr-3" /> Dashboard
                        </a>
                        <a
                            href="/attendance-history"
                            className={`flex items-center p-4 ${location.pathname === '/attendance-history' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaHistory className="mr-3" /> Attendance History
                        </a>
                        <a
                            href="/submit-form"
                            className={`flex items-center p-4 ${location.pathname === '/submit-form' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaFileAlt className="mr-3" /> Submit Form
                        </a>
                    </>
                )}
                {isAdmin && isAdminRoute && (
                    <>
                        <a
                            href="/admin-panel"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaUserShield className="mr-3" /> Admin Dashboard
                        </a>
                        <a
                            href="/admin-panel/user-list"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/user-list' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaUsers className="mr-3" /> User List
                        </a>
                        <a
                            href="/admin-panel/add-user"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-user' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaPlus className="mr-3" /> Add User
                        </a>
                        <a
                            href="/admin-panel/delete-user"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/delete-user' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaTrash className="mr-3" /> Delete User
                        </a>
                        <a
                            href="/admin-panel/add-department"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-department' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaBuilding className="mr-3" /> Add Department
                        </a>
                        <a
                            href="/admin-panel/add-courses"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-courses' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaBookOpen className="mr-3" /> Add Courses
                        </a>
                        <a
                            href="/admin-panel/add-teachers-details"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-teachers-details' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaChalkboardTeacher className="mr-3" /> Add Teachers Details
                        </a>
                        <a
                            href="/admin-panel/add-students-details"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-students-details' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaUsers className="mr-3" /> Add Student Details
                        </a>
                        <a
                            href="/admin-panel/add-notice"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/add-notice' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaBell className="mr-3" /> Add Notice
                        </a>
                        <a
                            href="/admin-panel/form-fill-up"
                            className={`flex items-center p-4 ${location.pathname === '/admin-panel/form-fill-up' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaClipboardList className="mr-3" /> Form Fill-up
                        </a>
                    </>
                )}
                {isTeacher && isTeacherRoute && (
                    <>
                        <a
                            href="/teachers/dashboard"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaChalkboardTeacher className="mr-3" /> Teacher Dashboard
                        </a>
                        <a
                            href="/teachers/offered-courses"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/offered-courses' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaBookOpen className="mr-3" /> Offered Courses
                        </a>
                        <a
                            href="/teachers/student-list"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/student-list' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaList className="mr-3" /> Student List
                        </a>
                        <a
                            href="/teachers/give-attendance"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/give-attendance' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaCheckSquare className="mr-3" /> Give Attendance
                        </a>
                        <a
                            href="/teachers/give-marks"
                            className={`flex items-center p-4 ${location.pathname === '/teachers/give-marks' ? 'bg-blue-700' : 'hover:bg-blue-700'} transition-all duration-300`}
                        >
                            <FaPen className="mr-3" /> Give Marks
                        </a>
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