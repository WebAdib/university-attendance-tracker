import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const GiveAttendance = () => {
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [studentsByCourse, setStudentsByCourse] = useState({});
    const [activeCourse, setActiveCourse] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString();
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const currentYear = new Date().getFullYear();

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
                    params: { teacherEmail: email, year: currentYear },
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
    }, [navigate, currentYear]);

    const handleSemesterChange = (e) => {
        setSelectedSemester(e.target.value);
        setActiveCourse(null);
        setStudentsByCourse({});
        setAttendanceStatus({});
    };

    const handleGoAhead = async () => {
        if (!selectedSemester) {
            setError('Please select a semester.');
            return;
        }
        try {
            const matchingCourses = teacherCourses.filter(course =>
                course.year === currentYear && course.semester === selectedSemester
            );
            if (matchingCourses.length === 0) {
                setError('No courses found for the selected semester and current year.');
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
            console.log('Course Response:', courseResponse.data);
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
            console.log('Students Response:', studentsResponse.data);
            if (!studentsResponse.data) {
                setError('No students found for this course');
                setStudentsByCourse(prev => ({ ...prev, [courseCode]: [] }));
                return;
            }

            const students = studentsResponse.data;
            // Fetch attendance status for each student
            const updatedStudents = await Promise.all(students.map(async (student) => {
                try {
                    const attendanceResponse = await api.get(`/students/attendance/${student.email}`, {
                        headers: { Authorization: `Bearer ${getAuthToken()}` },
                    });
                    const attendanceData = attendanceResponse.data || { courses: new Map() };
                    if (attendanceData.courses && typeof attendanceData.courses === 'object' && !(attendanceData.courses instanceof Map)) {
                        attendanceData.courses = new Map(Object.entries(attendanceData.courses));
                    }
                    const courseData = attendanceData.courses.get(courseCode);
                    if (courseData && courseData.attendanceRecords) {
                        const todayRecord = courseData.attendanceRecords.find(record =>
                            record.date && new Date(record.date).toISOString().split('T')[0] === todayDate
                        );
                        if (todayRecord) {
                            return { ...student, dbStatus: todayRecord.present ? 'present' : 'absent' };
                        }
                    }
                    return { ...student, dbStatus: null };
                } catch (err) {
                    console.error(`Error fetching attendance for ${student.email}:`, err);
                    return { ...student, dbStatus: null };
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

    const handleAttendanceChange = async (email, status) => {
        try {
            const attendanceResponse = await api.get(`/students/attendance/${email}`, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });
            let attendanceData = attendanceResponse.data || { 
                email: email,
                name: studentsByCourse[activeCourse].find(s => s.email === email)?.name || '',
                departmentName: studentsByCourse[activeCourse][0]?.departmentName || '',
                semester: selectedSemester,
                courses: new Map(),
            };

            // Convert courses to Map if received as an object
            if (attendanceData.courses && typeof attendanceData.courses === 'object' && !(attendanceData.courses instanceof Map)) {
                attendanceData.courses = new Map(Object.entries(attendanceData.courses));
            }

            // Create new document if it doesn't exist
            if (!attendanceData._id) {
                attendanceData = await api.post('/students/attendance', attendanceData, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                });
            }

            // Update or initialize course data
            let courseData = attendanceData.courses.get(activeCourse);
            if (!courseData) {
                courseData = { attendanceRecords: [], incourseMarks: 0, eligibleForForm: 'No' };
                attendanceData.courses.set(activeCourse, courseData);
            }

            // Find and update existing record for today, or add new if none
            const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const existingRecordIndex = courseData.attendanceRecords.findIndex(record =>
                record.date && new Date(record.date).toISOString().split('T')[0] === todayDate
            );
            const attendanceRecord = {
                date: new Date(),
                present: status === 'present',
            };

            if (existingRecordIndex >= 0) {
                courseData.attendanceRecords[existingRecordIndex] = attendanceRecord; // Update existing
            } else {
                courseData.attendanceRecords.push(attendanceRecord); // Add new
            }

            // Prepare payload with Map converted to object
            const updateData = {
                email: attendanceData.email,
                name: attendanceData.name,
                departmentName: attendanceData.departmentName,
                semester: attendanceData.semester,
                courses: Object.fromEntries(attendanceData.courses),
            };

            await api.put(`/students/attendance/${attendanceData._id}`, updateData, {
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });

            // Update local state with database status
            setAttendanceStatus(prev => ({
                ...prev,
                [email]: status,
            }));
            // Update studentsByCourse with new dbStatus
            setStudentsByCourse(prev => ({
                ...prev,
                [activeCourse]: prev[activeCourse].map(student =>
                    student.email === email ? { ...student, dbStatus: status } : student
                ),
            }));
            setError('');
        } catch (err) {
            setError('Failed to update attendance: ' + (err.response?.data?.message || err.message));
            console.error('Attendance update error:', err.response?.data || err);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Give Attendance</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Today's Date</label>
                            <input
                                type="text"
                                value={today}
                                readOnly
                                className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            disabled={!selectedSemester}
                            className={`w-full p-2 rounded-lg transition-all duration-300 ${!selectedSemester ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            Go Ahead
                        </button>
                    </div>

                    {selectedSemester && Object.keys(studentsByCourse).length > 0 && (
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
                                    {studentsByCourse[activeCourse].map((student) => {
                                        const dbStatus = student.dbStatus;
                                        return (
                                            <li key={student._id || student.email} className="border-b pb-2 flex items-center justify-between">
                                                <div>
                                                    <span className="font-semibold">{student.name || student.fullName}</span>
                                                    <span className="ml-4 text-gray-600">{student.email}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAttendanceChange(student.email, 'present')}
                                                        className={`px-3 py-1 rounded transition-all duration-300 ${dbStatus === 'present' 
                                                            ? 'bg-green-500 text-white' 
                                                            : 'bg-green-500 bg-opacity-0 text-green-500 hover:bg-opacity-100 hover:text-white'}`}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => handleAttendanceChange(student.email, 'absent')}
                                                        className={`px-3 py-1 rounded transition-all duration-300 ${dbStatus === 'absent' 
                                                            ? 'bg-red-500 text-white' 
                                                            : 'bg-red-500 bg-opacity-0 text-red-500 hover:bg-opacity-100 hover:text-white'}`}
                                                    >
                                                        Absent
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
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

export default GiveAttendance;