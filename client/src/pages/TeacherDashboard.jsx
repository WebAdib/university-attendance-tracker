import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import { FaBookOpen, FaList, FaCheckSquare, FaPen } from 'react-icons/fa';

const TeacherDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role !== 'teacher') {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <a
                        href="/teachers/offered-courses"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaBookOpen className="text-4xl text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Offered Courses</h2>
                            <p className="text-gray-600">View your courses</p>
                        </div>
                    </a>
                    <a
                        href="/teachers/student-list"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaList className="text-4xl text-green-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Student List</h2>
                            <p className="text-gray-600">View enrolled students</p>
                        </div>
                    </a>
                    <a
                        href="/teachers/give-attendance"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaCheckSquare className="text-4xl text-purple-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Give Attendance</h2>
                            <p className="text-gray-600">Upload attendance</p>
                        </div>
                    </a>
                    <a
                        href="/teachers/give-marks"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaPen className="text-4xl text-orange-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Give Marks</h2>
                            <p className="text-gray-600">Upload marks</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;