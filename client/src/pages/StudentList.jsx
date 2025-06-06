import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const fetchStudents = async () => {
            try {
                const response = await api.get('/teachers/students', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { subject: 'DefaultSubject' },
                });
                setStudents(response.data.students);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch students');
                setLoading(false);
            }
        };

        fetchStudents();
    }, [navigate]);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Student List</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {students.length === 0 ? (
                        <p className="text-gray-600">No students available.</p>
                    ) : (
                        <ul className="space-y-4">
                            {students.map((student) => (
                                <li key={student._id} className="border-b pb-2">
                                    <span className="font-semibold">{student.name}</span>
                                    <span className="ml-4 text-gray-600">{student.email}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentList;