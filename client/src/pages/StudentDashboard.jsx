import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import { FaBookOpen, FaBell, FaUser, FaFileAlt } from 'react-icons/fa';

const StudentDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role !== 'student') {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <a
                        href="/students/assigned-courses"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaBookOpen className="text-4xl text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Assigned Courses</h2>
                            <p className="text-gray-600">View your courses</p>
                        </div>
                    </a>
                    <a
                        href="/students/notices"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaBell className="text-4xl text-yellow-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Notices</h2>
                            <p className="text-gray-600">View latest notices</p>
                        </div>
                    </a>
                    <a
                        href="/students/student-details"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaUser className="text-4xl text-purple-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
                            <p className="text-gray-600">View your personal details</p>
                        </div>
                    </a>
                    <a
                        href="/students/submit-form"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaFileAlt className="text-4xl text-green-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Submit Form</h2>
                            <p className="text-gray-600">Submit your form</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;