import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const DeleteUser = () => {
    const [email, setEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.delete('/users', {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
                data: { email, adminPassword },
            });
            setMessage(response.data.message);
            setError('');
            setEmail('');
            setAdminPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
            setMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Delete User</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">User Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter user email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Admin Password</label>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
                        >
                            Delete User
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteUser;