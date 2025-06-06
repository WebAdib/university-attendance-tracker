import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaChartPie, FaBook, FaCheckCircle } from 'react-icons/fa';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/');
                return;
            }

            const decoded = JSON.parse(atob(token.split('.')[1]));
            if (decoded.role === 'admin') {
                navigate('/admin-panel');
                return;
            }

            const response = await api.get('/students/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return (
        <div className="text-center p-4">
            <p className="text-red-500">{error}</p>
            <button
                onClick={fetchData}
                className="mt-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to Your Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg">
                        <FaChartPie className="text-4xl text-blue-600" />
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>
                            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                <div
                                    className="bg-blue-600 h-3 rounded-full"
                                    style={{ width: `${data.attendancePercentage}%` }}
                                />
                            </div>
                            <p className="text-gray-600 mt-1">{data.attendancePercentage}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg">
                        <FaBook className="text-4xl text-green-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Incourse Marks</h2>
                            <p className="text-gray-600">{data.incourseMarks}/100</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transform transition-all duration-300 hover:shadow-lg">
                        <FaCheckCircle className="text-4xl text-purple-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Form Fill-Up Eligible</h2>
                            <p className={`text-lg font-semibold ${data.eligibleForForm ? 'text-green-600' : 'text-red-600'}`}>
                                {data.eligibleForForm ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;