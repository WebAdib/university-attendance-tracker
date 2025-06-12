import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const TeacherStatus = () => {
    const [department, setDepartment] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [teacher, setTeacher] = useState('');
    const [semester, setSemester] = useState('');
    const [course1, setCourse1] = useState('');
    const [course2, setCourse2] = useState('');
    const [course3, setCourse3] = useState('');
    const [course4, setCourse4] = useState('');
    const [course5, setCourse5] = useState('');
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
                console.error('Departments fetch error:', err);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (department) {
            const fetchTeachers = async () => {
                try {
                    const response = await api.get(`/teachers/details?department=${department}`, {
                        headers: { Authorization: `Bearer ${getAuthToken()}` },
                    });
                    setTeachers(response.data);
                } catch (err) {
                    setError('Failed to fetch teachers');
                    console.error('Teachers fetch error:', err);
                }
            };
            fetchTeachers();
        } else {
            setTeachers([]);
            setTeacher('');
        }
    }, [department]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courses = [course1, course2, course3, course4, course5].filter(code => code);
        if (!department || !teacher || !semester || courses.length === 0) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await api.post('/teacher-status', {
                department,
                teacher,
                semester,
                course1,
                course2,
                course3,
                course4,
                course5,
            }, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            setMessage(response.data.message);
            setError('');
            setDepartment('');
            setTeacher('');
            setSemester('');
            setCourse1('');
            setCourse2('');
            setCourse3('');
            setCourse4('');
            setCourse5('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add teacher status');
            console.error('Teacher status error:', err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Status</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Teacher</label>
                            <select
                                value={teacher}
                                onChange={(e) => setTeacher(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a teacher</option>
                                {teachers.map(t => (
                                    <option key={t._id} value={t._id}>{t.fullName}</option>
                                ))}
                            </select>
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
                                <option value="First Half">First Half</option>
                                <option value="Second Half">Second Half</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Course 1</label>
                            <input
                                type="text"
                                value={course1}
                                onChange={(e) => setCourse1(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter course code (e.g., CS101)"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Course 2</label>
                            <input
                                type="text"
                                value={course2}
                                onChange={(e) => setCourse2(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter course code (e.g., CS102)"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Course 3</label>
                            <input
                                type="text"
                                value={course3}
                                onChange={(e) => setCourse3(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter course code (e.g., CS103)"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Course 4</label>
                            <input
                                type="text"
                                value={course4}
                                onChange={(e) => setCourse4(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter course code (e.g., CS104)"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Course 5</label>
                            <input
                                type="text"
                                value={course5}
                                onChange={(e) => setCourse5(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter course code (e.g., CS105)"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                        >
                            Assign Teacher Status
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeacherStatus;