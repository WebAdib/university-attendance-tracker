import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaBell, FaTrash } from 'react-icons/fa';

const AddNotice = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            setError('Please log in to view notices');
            setLoading(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        if (!token) {
            setError('Please log in as an admin to add a notice');
            return;
        }

        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            if (decoded.role !== 'admin') {
                setError('Only admins can add notices');
                return;
            }

            const response = await api.post('/admin-panel/add-notice', { title, content }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message);
            setError('');
            setTitle('');
            setContent('');
            setNotices([...notices, response.data.notice]); // Update notices state with new notice
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add notice');
            setMessage('');
        }
    };

    const handleDeleteNotice = async (id) => {
        const token = getAuthToken();
        try {
            await api.delete(`/notices/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotices(notices.filter(notice => notice._id !== id));
            setMessage('Notice deleted successfully');
            setError('');
        } catch (err) {
            setError('Failed to delete notice: ' + (err.response?.data?.message || err.message));
            setMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Notice</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter notice title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter notice content"
                                rows="4"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                        >
                            Add Notice
                        </button>
                    </form>
                    {/* Notices displayed below the form */}
                    {loading ? (
                        <p className="text-gray-600 mt-6">Loading notices...</p>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {notices.length === 0 ? (
                                <p className="text-gray-600">No notices available.</p>
                            ) : (
                                notices.map((notice) => (
                                    <div key={notice._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <FaBell className="text-3xl text-yellow-600" />
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-800">{notice.title}</h2>
                                                <p className="text-gray-600">{notice.content}</p>
                                            </div>
                                        </div>
                                        {getAuthToken() && JSON.parse(atob(getAuthToken().split('.')[1])).role === 'admin' && (
                                            <button
                                                onClick={() => handleDeleteNotice(notice._id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddNotice;