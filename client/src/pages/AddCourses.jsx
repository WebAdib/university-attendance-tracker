import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const AddCourses = () => {
    const [courseName, setCourseName] = useState('');
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/departments', {
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                });
                setDepartments(response.data);
            } catch (err) {
                setError('Failed to fetch departments');
            }
        };
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/courses', { name: courseName, department }, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            setMessage(response.data.message);
            setError('');
            setCourseName('');
            setDepartment('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add course');
            setMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Courses</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Course Name</label>
                            <input
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter course name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Department</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a department</option>
                                {departments.map(dep => (
                                    <option key={dep._id} value={dep._id}>{dep.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                        >
                            Add Course
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCourses;