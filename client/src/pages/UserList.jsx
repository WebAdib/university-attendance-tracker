import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await api.get('/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">User List</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Admins</h2>
                    <ul className="space-y-2">
                        {users.filter(user => user.role === 'admin').map(user => (
                            <li key={user._id} className="border-b pb-2">{user.name} ({user.email})</li>
                        ))}
                    </ul>
                    <h2 className="text-xl font-semibold mt-4 mb-4">Teachers</h2>
                    <ul className="space-y-2">
                        {users.filter(user => user.role === 'teacher').map(user => (
                            <li key={user._id} className="border-b pb-2">{user.name} ({user.email})</li>
                        ))}
                    </ul>
                    <h2 className="text-xl font-semibold mt-4 mb-4">Students</h2>
                    <ul className="space-y-2">
                        {users.filter(user => user.role === 'student').map(user => (
                            <li key={user._id} className="border-b pb-2">{user.name} ({user.email})</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserList;