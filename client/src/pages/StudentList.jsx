import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const StudentList = () => {
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [studentsByCourse, setStudentsByCourse] = useState({});
    const [activeCourse, setActiveCourse] = useState(null);
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
        setActiveCourse(null); // Reset active course when year changes
        setStudentsByCourse({});
    };

    const handleSemesterChange = (e) => {
        setSelectedSemester(e.target.value);
        setActiveCourse(null); // Reset active course when semester changes
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

            // Fetch students for each matching course
            const studentsData = {};
            for (const course of matchingCourses) {
                const courses = [course.course1, course.course2, course.course3, course.course4, course.course5].filter(c => c);
                for (const courseCode of courses) {
                    const response = await api.get('/teachers/students', {
                        headers: { Authorization: `Bearer ${getAuthToken()}` },
                        params: { subject: courseCode },
                    });
                    studentsData[courseCode] = response.data.students || [];
                }
            }
            setStudentsByCourse(studentsData);
            setError('');
        } catch (err) {
            setError('Failed to fetch students: ' + (err.response?.data?.message || err.message));
            console.error('Students fetch error:', err.response?.data || err);
        }
    };

    const handleCourseClick = (courseCode) => {
        setActiveCourse(courseCode === activeCourse ? null : courseCode);
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Student List</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
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
                                        <li key={student._id} className="border-b pb-2">
                                            <span className="font-semibold">{student.name}</span>
                                            <span className="ml-4 text-gray-600">{student.email}</span>
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

export default StudentList;