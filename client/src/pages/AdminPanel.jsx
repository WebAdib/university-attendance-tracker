import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import { FaUsers, FaPlus, FaTrash, FaBuilding, FaBookOpen, FaBell, FaClipboardList, FaChalkboardTeacher } from 'react-icons/fa';

const AdminPanel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role !== 'admin') {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <a
                        href="/admin-panel/user-list"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaUsers className="text-4xl text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">User List</h2>
                            <p className="text-gray-600">View all users</p>
                        </div>
                    </a>
                    <a
                        href="/admin-panel/add-user"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaPlus className="text-4xl text-green-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add User</h2>
                            <p className="text-gray-600">Add or bulk upload users</p>
                        </div>
                    </a>
                    <a
                        href="/admin-panel/delete-user"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaTrash className="text-4xl text-red-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Delete User</h2>
                            <p className="text-gray-600">Remove users securely</p>
                        </div>
                    </a>
                    <a
                        href="/admin-panel/add-department"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaBuilding className="text-4xl text-purple-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Department</h2>
                            <p className="text-gray-600">Manage departments</p>
                        </div>
                    </a>
                    <a
                        href="/admin-panel/add-courses"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaBookOpen className="text-4xl text-orange-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Courses</h2>
                            <p className="text-gray-600">Add courses by department</p>
                        </div>
                    </a>
                    <a
                        href="/admin-panel/add-teachers-details"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaChalkboardTeacher className="text-4xl text-indigo-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Teachers Details</h2>
                            <p className="text-gray-600">Manage teacher information</p>
                        </div>
                    </a>
                    <a
                        href="/admin-panel/add-students-details"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaUsers className="text-4xl text-pink-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Student Details</h2>
                            <p className="text-gray-600">Manage student information</p>
                        </div>
                    </a>
                    <a
                        href="/admin-panel/add-notice"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaBell className="text-4xl text-yellow-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Add Notice</h2>
                            <p className="text-gray-600">Create university notices</p>
                        </div>
                    </a>
                    <a
                        href="/admin-panel/form-fill-up"
                        className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg hover:bg-blue-50"
                    >
                        <FaClipboardList className="text-4xl text-teal-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Form Fill-up</h2>
                            <p className="text-gray-600">Manage form submissions</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;