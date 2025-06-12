import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const StudentStatus = () => {
    const [email, setEmail] = useState('');
    const [semester, setSemester] = useState('');
    const [courses, setCourses] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [showDetails, setShowDetails] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCourses = async () => {
        if (!email || !semester) {
            setError('Please enter email and select a semester');
            return;
        }
        try {
            const response = await api.get('/students/status/courses', {
                params: { email, semester },
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            setCourses(response.data);
            setShowDetails(true);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch courses');
            setShowDetails(false);
            console.error('Courses fetch error:', err);
        }
    };

    const handleConfirm = async () => {
        if (!email || !semester || !paymentStatus) {
            setError('All fields are required');
            return;
        }
        if (paymentStatus !== 'done') {
            setError('Payment must be marked as done to confirm');
            return;
        }
        try {
            const response = await api.post('/students/status', {
                email,
                semester,
                paymentStatus,
            }, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            setMessage(response.data.message);
            setError('');
            setPaymentStatus('pending'); // Reset for next use
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save student status');
            console.error('Save status error:', err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Status</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Student Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter student email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Semester</label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select semester</option>
                                {[...Array(8)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={fetchCourses}
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                        >
                            Show Courses
                        </button>
                    </form>
                    {showDetails && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Details</h2>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                {courses.length > 0 ? (
                                    <>
                                        <h3 className="text-xl font-semibold text-gray-700">Course List</h3>
                                        {courses.map((course, index) => (
                                            <div key={index} className="mb-2 p-2 bg-white rounded shadow">
                                                <p><strong>Course Code:</strong> {course.courseCode}</p>
                                                <p><strong>Course Name:</strong> {course.name}</p>
                                                <p><strong>Credit Hours:</strong> {course.creditHours}</p>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-gray-600">No courses found for this semester.</p>
                                )}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Payment Status</label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                                    disabled={paymentStatus !== 'done'}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentStatus;