import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const AttendanceHistory = () => {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const fetchHistory = async () => {
            try {
                const response = await api.get('/students/attendance-history', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecords(response.data.attendanceRecords);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch attendance history');
            }
        };

        fetchHistory();
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Attendance History</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {records.length === 0 ? (
                        <p className="text-gray-600">No attendance records available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {records.map((record, index) => (
                                <li key={index} className="border-b pb-2">
                                    <span className="font-semibold">{new Date(record.date).toLocaleDateString()}</span>
                                    <span className={`ml-4 ${record.present ? 'text-green-600' : 'text-red-600'}`}>
                                        {record.present ? 'Present' : 'Absent'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceHistory;