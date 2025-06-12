import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const UserList = () => {
    const [activeTab, setActiveTab] = useState('admin');
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedTeacherEmail, setSelectedTeacherEmail] = useState(null);
    const [teacherDetails, setTeacherDetails] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const usersResponse = await api.get('/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const adminsList = usersResponse.data.filter(user => user.role === 'admin');
                const teachersList = usersResponse.data.filter(user => user.role === 'teacher');
                const studentsList = usersResponse.data.filter(user => user.role === 'student');
                setAdmins(adminsList);
                setTeachers(teachersList);
                setStudents(studentsList);
                setUsers(usersResponse.data);

                const deptsResponse = await api.get('/departments', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDepartments(deptsResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const fetchTeachersByDepartment = async () => {
        if (!selectedDepartment) {
            setTeachers(users.filter(user => user.role === 'teacher').map(user => ({ email: user.email, fullName: user.name })));
            return;
        }
        try {
            const response = await api.get('/teachers/details', {
                params: { department: selectedDepartment },
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            setTeachers(response.data);
        } catch (err) {
            setError('Failed to fetch teachers');
            console.error('Teachers fetch error:', err);
        }
    };

    useEffect(() => {
        fetchTeachersByDepartment();
    }, [selectedDepartment]);

    const fetchTeacherDetails = async (email) => {
        try {
            const response = await api.get('/teachers/detail', {
                params: { email },
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            setTeacherDetails(response.data || {});
            setSelectedTeacherEmail(email);
        } catch (err) {
            setError('Failed to fetch teacher details');
            console.error('Teacher details fetch error:', err);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">User List</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex space-x-4 mb-6 border-b">
                        <button
                            onClick={() => {
                                setActiveTab('admin');
                                setSelectedDepartment('');
                                setTeacherDetails({});
                                setSelectedTeacherEmail(null);
                            }}
                            className={`flex items-center p-2 rounded-t-lg ${activeTab === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition-all duration-300`}
                        >
                            <FaUserShield className="mr-2" /> Admin List
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('teacher');
                                setSelectedDepartment('');
                                setTeacherDetails({});
                                setSelectedTeacherEmail(null);
                                fetchTeachersByDepartment();
                            }}
                            className={`flex items-center p-2 rounded-t-lg ${activeTab === 'teacher' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition-all duration-300`}
                        >
                            <FaChalkboardTeacher className="mr-2" /> Teacher List
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('student');
                                setSelectedDepartment('');
                                setTeacherDetails({});
                                setSelectedTeacherEmail(null);
                            }}
                            className={`flex items-center p-2 rounded-t-lg ${activeTab === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition-all duration-300`}
                        >
                            <FaUserGraduate className="mr-2" /> Student List
                        </button>
                    </div>
                    {activeTab === 'admin' && (
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Admin List</h2>
                            <ul className="space-y-2">
                                {admins.map(user => (
                                    <li key={user._id} className="border-b pb-2">
                                        {user.name} ({user.email})
                                    </li>
                                ))}
                            </ul>
                            {admins.length === 0 && <p className="text-gray-600">No admins found.</p>}
                        </div>
                    )}
                    {activeTab === 'teacher' && (
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-1">Select Department</label>
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map((dept) => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <ul className="space-y-2">
                                {teachers.length > 0 ? (
                                    teachers.map(teacher => (
                                        <li key={teacher.email} className="border-b pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div>
                                                <p><strong>Name:</strong> {teacher.fullName || 'Unknown'}</p>
                                                <p><strong>Email:</strong> {teacher.email}</p>
                                            </div>
                                            <button
                                                onClick={() => fetchTeacherDetails(teacher.email)}
                                                className="mt-2 sm:mt-0 bg-blue-600 text-white p-1 rounded-lg hover:bg-blue-700 transition-all duration-300"
                                            >
                                                More Details
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No teachers registered yet.</p>
                                )}
                            </ul>
                            {selectedTeacherEmail && (
                                <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Teacher Details</h3>
                                    <p><strong>Full Name:</strong> {teacherDetails.fullName || 'null'}</p>
                                    <p><strong>Email:</strong> {teacherDetails.email || 'null'}</p>
                                    <p><strong>Phone:</strong> {teacherDetails.phoneNumber || 'null'}</p>
                                    <p><strong>Address:</strong> {teacherDetails.address || 'null'}</p>
                                    <p><strong>Department:</strong> {teacherDetails.department?.name || teacherDetails.departmentName || 'null'}</p>
                                    <p><strong>Designation:</strong> {teacherDetails.designation || 'null'}</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'student' && (
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Student List</h2>
                            <ul className="space-y-2">
                                {students.map(user => (
                                    <li key={user._id} className="border-b pb-2">
                                        {user.name} ({user.email})
                                    </li>
                                ))}
                            </ul>
                            {students.length === 0 && <p className="text-gray-600">No students found.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserList;