import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await api.get('/students/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dashboard data');
            }
        };

        fetchData();
    }, [navigate]);

    if (!data) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Student Dashboard</h1>
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">Attendance: {data.attendancePercentage}%</h2>
                <h2 className="text-xl font-semibold mb-4">Incourse Marks: {data.incourseMarks}/100</h2>
                <h2 className="text-xl font-semibold">
                    Form Fill-Up Eligible: {data.eligibleForForm ? 'Yes' : 'No'}
                </h2>
            </div>
        </div>
    );
};

export default Dashboard;