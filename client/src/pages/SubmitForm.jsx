import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const SubmitForm = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [comments, setComments] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/students/submit-form', { comments }, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            setMessage(response.data.message);
            setError('');
            setComments('');
        } catch (err) {
            setError(err.response?.data?.message || 'Form submission failed');
            setMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Submit Form</h1>
                {message && <p className="text-green-600 mb-4">{message}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Comments</label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                placeholder="Add your comments (max 500 characters)"
                                maxLength={500}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                        >
                            Submit Form
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitForm;