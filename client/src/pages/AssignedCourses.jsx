import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import { FaList } from 'react-icons/fa';

const AssignedCourses = () => {
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
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Assigned Courses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center space-x-4">
                            <FaList className="text-4xl text-blue-600" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Semester 1 - 510221</h2>
                                <p className="text-gray-600">Present: 0/0 (0%)</p>
                                <p className="text-gray-600">Marks: 0/100</p>
                                <p className="text-red-600">Eligible: No</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center space-x-4">
                            <FaList className="text-4xl text-blue-600" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Semester 1 - 510222</h2>
                                <p className="text-gray-600">Present: 0/0 (0%)</p>
                                <p className="text-gray-600">Marks: 0/100</p>
                                <p className="text-red-600">Eligible: No</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignedCourses;