import Sidebar from '../components/Sidebar';

const OfferedCourses = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Offered Courses</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-gray-600">Courses you offer will be listed here.</p>
                </div>
            </div>
        </div>
    );
};

export default OfferedCourses;