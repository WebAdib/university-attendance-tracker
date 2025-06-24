import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaBell } from 'react-icons/fa';

const TeacherNotices = () => {
    const [notices, setNotices] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
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
            return;
        }

        const fetchNotices = async () => {
            try {
                const response = await api.get('/notices', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('API Response:', response.data); // Debug response
                setNotices(response.data || []);
            } catch (err) {
                setError('Failed to fetch notices: ' + (err.response?.data?.message || err.message));
                console.error('Notices fetch error:', err.response?.data || err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, [navigate]);

    // Format date to show only date part (e.g., "24/06/2025")
    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) : 'N/A';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Notices</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {loading ? (
                    <p className="text-gray-600">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notices.length === 0 ? (
                            <p className="text-gray-600">No notices available.</p>
                        ) : (
                            notices.map((notice) => (
                                <div key={notice._id} className="bg-white p-6 rounded-xl shadow-md">
                                    <div className="flex items-center space-x-4">
                                        <FaBell className="text-4xl text-yellow-600" />
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">{notice.title}</h2>
                                            <p className="text-gray-600">{notice.content}</p>
                                            <p className="text-gray-500 text-sm mt-2">
                                                Posted on: {formatDate(notice.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherNotices;