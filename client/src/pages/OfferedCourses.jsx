import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const OfferedCourses = () => {
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const fetchTeacherCourses = async () => {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                console.log('Decoded Token Payload:', decoded);
                const userId = decoded._id;
                if (!userId) {
                    throw new Error('User ID not found in token');
                }
                console.log('User ID:', userId);

                const userResponse = await api.get('/users/' + userId, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const email = userResponse.data.email;
                console.log('Fetched Email:', email);

                const response = await api.get('/teachers/status', {
                    params: { teacherEmail: email },
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Teacher Courses Response:', response.data);
                setTeacherCourses(response.data || []);
            } catch (err) {
                setError('Failed to fetch offered courses: ' + (err.response?.data?.message || err.message));
                console.error('Teacher courses fetch error:', err.response?.data || err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherCourses();
    }, [navigate]);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Offered Courses</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {teacherCourses.length > 0 ? (
                        <div>
                            {teacherCourses.map((course, index) => (
                                <div key={index}>
                                    <p><strong>Year:</strong> {course.year || 'N/A'}</p>
                                    <p><strong>Semester:</strong> {course.semester || 'N/A'}</p>
                                    <p><strong>Courses1:</strong> {course.course1 || 'N/A'}</p>
                                    <p><strong>Courses2:</strong> {course.course2 || 'N/A'}</p>
                                    <p><strong>Courses3:</strong> {course.course3 || 'N/A'}</p>
                                    <p><strong>Courses4:</strong> {course.course4 || 'N/A'}</p>
                                    <p><strong>Courses5:</strong> {course.course5 || 'N/A'}</p>
                                    {index < teacherCourses.length - 1 && <hr className="my-4 border-gray-300" />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No courses assigned.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfferedCourses;