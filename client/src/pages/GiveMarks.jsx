import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const GiveMarks = () => {
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [studentsByCourse, setStudentsByCourse] = useState({});
    const [activeCourse, setActiveCourse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
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
                setError('Failed to fetch teacher courses: ' + (err.response?.data?.message || err.message));
                console.error('Teacher courses fetch error:', err.response?.data || err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherCourses();
    }, [navigate]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
        setActiveCourse(null);
        setStudentsByCourse({});
    };

    const handleSemesterChange = (e) => {
        setSelectedSemester(e.target.value);
        setActiveCourse(null);
        setStudentsByCourse({});
    };

    const handleGoAhead = async () => {
        if (!selectedYear || !selectedSemester) {
            setError('Please select both year and semester.');
            return;
        }
        try {
            const matchingCourses = teacherCourses.filter(course =>
                course.year === parseInt(selectedYear) && course.semester === selectedSemester
            );
            if (matchingCourses.length === 0) {
                setError('No courses found for the selected year and semester.');
                setStudentsByCourse({});
                return;
            }

            const courseCodes = [];
            for (const course of matchingCourses) {
                const codes = [course.course1, course.course2, course.course3, course.course4, course.course5].filter(c => c);
                courseCodes.push(...codes);
            }
            setStudentsByCourse({ ...courseCodes.reduce((acc, code) => ({ ...acc, [code]: [] }), {}) });
            setError('');
        } catch (err) {
            setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
            console.error('Data fetch error:', err.response?.data || err);
        }
    };

    const handleCourseClick = async (courseCode) => {
        if (activeCourse === courseCode) {
            setActiveCourse(null);
            return;
        }
        setActiveCourse(courseCode);
        try {
            const courseResponse = await api.get('/courses', {
                params: { courseCode },
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            const course = courseResponse.data[0];
            if (!course) {
                setError(`Course ${courseCode} not found`);
                setStudentsByCourse(prev => ({ ...prev, [courseCode]: [] }));
                return;
            }

            const studentsResponse = await api.get('/teachers/students-by-semester-dept', {
                params: { 
                    semester: course.semester,
                    departmentName: course.departmentName
                },
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            const students = studentsResponse.data || [];

            // Fetch existing incourseMarks for each student
            const updatedStudents = await Promise.all(students.map(async (student) => {
                try {
                    const marksResponse = await api.get('/teachers/student-marks', {
                        params: { email: student.email, courseCode },
                        headers: { Authorization: `Bearer ${getAuthToken()}` },
                    });
                    const incourseMarks = marksResponse.data.incourseMarks || '';
                    return {
                        ...student,
                        currentMarks: incourseMarks
                    };
                } catch (err) {
                    console.error(`Error fetching marks for ${student.email}:`, err);
                    return { ...student, currentMarks: '' };
                }
            }));

            setStudentsByCourse(prev => ({ ...prev, [courseCode]: updatedStudents }));
            setError('');
        } catch (err) {
            setError('Failed to fetch students: ' + (err.response?.data?.message || err.message));
            console.error('Students fetch error:', err.response?.data || err);
            setStudentsByCourse(prev => ({ ...prev, [courseCode]: [] }));
        }
    };

    const handleMarksSubmit = async (email) => {
        const marksInput = document.getElementById(`marks-${email}`);
        const marks = marksInput.value;
        if (!marks || isNaN(marks) || Number(marks) < 0 || Number(marks) > 100) {
            setError('Please enter a valid mark between 0 and 100');
            return;
        }
        try {
            const response = await api.put(`/teachers/upload-marks`, {
                email,
                marks: Number(marks),
                courseCode: activeCourse
            }, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            setMessage(response.data.message);
            setError('');

            // Re-fetch marks from database
            const marksResponse = await api.get('/teachers/student-marks', {
                params: { email, courseCode: activeCourse },
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            const newMarks = marksResponse.data.incourseMarks || '';

            setStudentsByCourse(prev => ({
                ...prev,
                [activeCourse]: prev[activeCourse].map(student =>
                    student.email === email ? { ...student, currentMarks: newMarks } : student
                )
            }));
            marksInput.value = newMarks;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload marks');
            console.error('Upload error:', err.response?.data || err);
            setMessage('');
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Give Marks</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Select Year</label>
                            <input
                                type="number"
                                value={selectedYear}
                                onChange={handleYearChange}
                                placeholder="Enter year (e.g., 2025)"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Select Semester</label>
                            <select
                                value={selectedSemester}
                                onChange={handleSemesterChange}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Semester</option>
                                <option value="First Half">First Half</option>
                                <option value="Second Half">Second Half</option>
                            </select>
                        </div>
                        <button
                            onClick={handleGoAhead}
                            disabled={!selectedYear || !selectedSemester}
                            className={`w-full p-2 rounded-lg transition-all duration-300 ${!selectedYear || !selectedSemester ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            Go Ahead
                        </button>
                    </div>

                    {selectedYear && selectedSemester && Object.keys(studentsByCourse).length > 0 && (
                        <div className="mb-6">
                            <div className="flex space-x-4 mb-4 border-b">
                                {Object.keys(studentsByCourse).map((courseCode) => (
                                    <button
                                        key={courseCode}
                                        onClick={() => handleCourseClick(courseCode)}
                                        className={`p-2 rounded-t-lg ${activeCourse === courseCode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition-all duration-300`}
                                    >
                                        {courseCode}
                                    </button>
                                ))}
                            </div>
                            {activeCourse && studentsByCourse[activeCourse] && studentsByCourse[activeCourse].length > 0 ? (
                                <ul className="space-y-2">
                                    {studentsByCourse[activeCourse].map((student) => (
                                        <li key={student._id || student.email} className="border-b pb-2 flex items-center justify-between">
                                            <div>
                                                <span className="font-semibold">{student.name || student.fullName}</span>
                                                <span className="ml-4 text-gray-600">{student.email}</span>
                                            </div>
                                            <div className="flex space-x-2 items-center">
                                                <input
                                                    id={`marks-${student.email}`}
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={student.currentMarks || ''} // Pre-fill with incourseMarks
                                                    onChange={(e) => {
                                                        setStudentsByCourse(prev => ({
                                                            ...prev,
                                                            [activeCourse]: prev[activeCourse].map(s =>
                                                                s.email === student.email ? { ...s, currentMarks: e.target.value } : s
                                                            )
                                                        }));
                                                    }}
                                                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                                                />
                                                <button
                                                    onClick={() => handleMarksSubmit(student.email)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all duration-300"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : activeCourse ? (
                                <p className="text-gray-600">No students enrolled in this course.</p>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiveMarks;