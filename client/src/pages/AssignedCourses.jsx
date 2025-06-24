import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const AssignedCourses = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [studentData, setStudentData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAttendance, setShowAttendance] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const fetchAssignedCourses = async () => {
            try {
                console.log('Token:', token); // Debug token
                const decoded = JSON.parse(atob(token.split('.')[1]));
                console.log('Decoded Token Payload:', decoded); // Debug full payload
                const userId = decoded._id; // Assuming '_id' is the field for user ID
                if (!userId) {
                    throw new Error('User ID not found in token');
                }
                console.log('User ID to fetch:', userId); // Debug user ID

                // Fetch user to get email
                const userResponse = await api.get(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const email = userResponse.data.email;
                console.log('Fetched Email:', email); // Debug email

                // Fetch assigned courses using the email
                const coursesResponse = await api.get('/students/assigned-courses', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { email },
                });
                console.log('API Request URL:', api.getUri()); // Debug full request URL
                console.log('API Response:', coursesResponse.data); // Debug response
                setStudentData(coursesResponse.data || {});
            } catch (err) {
                const errorMessage = 'Failed to fetch assigned courses: ' + (err.response?.data?.message || err.message);
                setError(errorMessage);
                console.error('Assigned courses fetch error:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message,
                    config: err.config, // Debug request config
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedCourses();
    }, [navigate]);

    // Function to download CSV
    const downloadCSV = (courseCode, attendanceRecords) => {
        const headers = ['Course Code', 'Date', 'Present'];
        const rows = attendanceRecords.map(record => [
            courseCode,
            record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
            record.present ? 'Yes' : 'No'
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${courseCode}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Assigned Courses</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {loading ? (
                        <p className="text-gray-600">Loading...</p>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">Student Info</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label className="block text-gray-600">Name</label>
                                        <input
                                            type="text"
                                            value={studentData.name || 'N/A'}
                                            readOnly
                                            className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600">Department</label>
                                        <input
                                            type="text"
                                            value={studentData.departmentName || 'N/A'}
                                            readOnly
                                            className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600">Semester</label>
                                        <input
                                            type="text"
                                            value={studentData.semester || 'N/A'}
                                            readOnly
                                            className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">Courses</h2>
                                {Object.entries(studentData.courses || {}).length === 0 ? (
                                    <p className="text-gray-600">No courses assigned.</p>
                                ) : (
                                    <div className="mt-2 space-y-6">
                                        {Object.entries(studentData.courses || {}).map(([courseCode, courseData]) => (
                                            <div key={courseCode}>
                                                <div className="p-4 border rounded-lg bg-gray-50">
                                                    <h3 className="text-lg font-medium text-gray-800">Course: {courseCode}</h3>
                                                    <table className="w-full mt-2 border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-200">
                                                                <th className="border p-2 text-left">Metric</th>
                                                                <th className="border p-2 text-left">Value</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="border p-2">Total Days</td>
                                                                <td className="border p-2">{courseData.totalDays || '0'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border p-2">Present Days</td>
                                                                <td className="border p-2">{courseData.presentDays || '0'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border p-2">Attendance %</td>
                                                                <td className="border p-2">{courseData.attendancePercentage || '0'}%</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border p-2">Incourse Marks</td>
                                                                <td className="border p-2">{courseData.incourseMarks || '0'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border p-2">Eligible for Form</td>
                                                                <td className="border p-2">{courseData.eligibleForForm || 'No'}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <button
                                                    onClick={() => setShowAttendance(prev => ({ ...prev, [courseCode]: !prev[courseCode] }))}
                                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    {showAttendance[courseCode] ? 'Hide Attendance' : 'See Attendance'}
                                                </button>
                                                {showAttendance[courseCode] && courseData.attendanceRecords && courseData.attendanceRecords.length > 0 && (
                                                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                                        <h4 className="text-md font-medium text-gray-800">Attendance Details for {courseCode}</h4>
                                                        <table className="w-full mt-2 border-collapse">
                                                            <thead>
                                                                <tr className="bg-gray-200">
                                                                    <th className="border p-2 text-left">Date</th>
                                                                    <th className="border p-2 text-left">Present</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {courseData.attendanceRecords.map((record, index) => (
                                                                    <tr key={index}>
                                                                        <td className="border p-2">{record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}</td>
                                                                        <td className="border p-2">{record.present ? 'Yes' : 'No'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        <button
                                                            onClick={() => downloadCSV(courseCode, courseData.attendanceRecords)}
                                                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                        >
                                                            Download CSV
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Function to download CSV
const downloadCSV = (courseCode, attendanceRecords) => {
    const headers = ['Course Code', 'Date', 'Present'];
    const rows = attendanceRecords.map(record => [
        courseCode,
        record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
        record.present ? 'Yes' : 'No'
    ]);
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${courseCode}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
};

export default AssignedCourses;