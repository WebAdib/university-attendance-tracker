import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const OfferedCourses = () => {
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [popupData, setPopupData] = useState(null);
    const [selectedDate, setSelectedDate] = useState({});
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

    const handleShowAttendance = async (courseCode) => {
        const date = selectedDate[courseCode] || new Date().toISOString().split('T')[0];
        try {
            const response = await api.get('/teachers/students-by-course', {
                params: { courseCode, date },
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            console.log('Attendance Response:', response.data);
            const attendanceData = response.data || [];
            setPopupData({ courseCode, date, data: attendanceData });
        } catch (err) {
            setError('Failed to fetch attendance: ' + (err.response?.data?.message || err.message));
            console.error('Attendance fetch error:', err.response?.data || err);
        }
    };

    const downloadCSV = () => {
        if (!popupData) return;
        const { date, data } = popupData;
        const csv = [
            ['Date', 'Name', 'Email', 'Attendance Status'],
            ...data.map(item => [
                date,
                item.name || item.fullName || 'N/A',
                item.email || 'N/A',
                item.attendanceStatus || 'N/A'
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${popupData.courseCode}_${date}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

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
                                <div key={index} className="mb-6">
                                    <p><strong>Year:</strong> {course.year || 'N/A'}</p>
                                    <p><strong>Semester:</strong> {course.semester || 'N/A'}</p>
                                    {['course1', 'course2', 'course3', 'course4', 'course5'].map(field => {
                                        if (course[field]) {
                                            return (
                                                <div key={field} className="flex items-center space-x-4 my-2">
                                                    <p><strong>{field.replace('course', 'Course ')}:</strong> {course[field]}</p>
                                                    <input
                                                        type="date"
                                                        value={selectedDate[course[field]] || ''}
                                                        onChange={(e) => setSelectedDate(prev => ({ ...prev, [course[field]]: e.target.value }))}
                                                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        onClick={() => handleShowAttendance(course[field])}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300"
                                                    >
                                                        Show Attendance
                                                    </button>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                    {index < teacherCourses.length - 1 && <hr className="my-4 border-gray-300" />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No courses assigned.</p>
                    )}
                </div>
                {popupData && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg w-3/4 max-h-[80vh] overflow-auto">
                            <h2 className="text-2xl font-bold mb-4">Attendance for {popupData.courseCode} on {popupData.date}</h2>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Name</th>
                                        <th className="border p-2">Email</th>
                                        <th className="border p-2">Attendance Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {popupData.data.length > 0 ? (
                                        popupData.data.map((item, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-100' : ''}>
                                                <td className="border p-2">{popupData.date}</td>
                                                <td className="border p-2">{item.name || item.fullName || 'N/A'}</td>
                                                <td className="border p-2">{item.email || 'N/A'}</td>
                                                <td className="border p-2">{item.attendanceStatus || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="border p-2 text-center">No attendance data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <button
                                onClick={downloadCSV}
                                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
                            >
                                Download CSV
                            </button>
                            <button
                                onClick={() => setPopupData(null)}
                                className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfferedCourses;