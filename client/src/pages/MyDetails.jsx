import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const MyDetails = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [teacherDetails, setTeacherDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const fetchTeacherDetails = async () => {
            try {
                console.log('Token:', token); // Debug token
                const decoded = JSON.parse(atob(token.split('.')[1]));
                console.log('Decoded Token Payload:', decoded); // Debug full payload
                const userId = decoded._id; // Assuming 'id' is the field for user ID
                if (!userId) {
                    throw new Error('User ID not found in token');
                }
                console.log('User ID to fetch:', userId); // Debug user ID

                // Fetch user to get email
                const userResponse = await api.get('/users/' + userId, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const email = userResponse.data.email;
                console.log('Fetched Email:', email); // Debug email

                // Fetch teacher details using the email
                const detailsResponse = await api.get('/teachers/detail', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { email },
                });
                console.log('API Response:', detailsResponse.data); // Debug response
                setTeacherDetails(detailsResponse.data || {});
            } catch (err) {
                setError('Failed to fetch teacher details: ' + (err.response?.data?.message || err.message));
                console.error('Teacher details fetch error:', err.response?.data || err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherDetails();
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Details</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {loading ? (
                        <p className="text-gray-600">Loading...</p>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={teacherDetails.fullName || 'N/A'}
                                    readOnly
                                    className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                                <input
                                    type="email"
                                    value={teacherDetails.email || 'N/A'}
                                    readOnly
                                    className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={teacherDetails.phoneNumber || 'N/A'}
                                    readOnly
                                    className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Address</label>
                                <input
                                    type="text"
                                    value={teacherDetails.address || 'N/A'}
                                    readOnly
                                    className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Department</label>
                                <input
                                    type="text"
                                    value={teacherDetails.department?.name || teacherDetails.departmentName || 'N/A'}
                                    readOnly
                                    className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Designation</label>
                                <input
                                    type="text"
                                    value={teacherDetails.designation || 'N/A'}
                                    readOnly
                                    className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyDetails;