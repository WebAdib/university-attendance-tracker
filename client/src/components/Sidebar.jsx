import { FaHome, FaSignOutAlt, FaHistory, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="w-64 h-screen bg-blue-900 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-blue-700">
                University Portal
            </div>
            <nav className="flex-1">
                <a href="/dashboard" className="flex items-center p-4 hover:bg-blue-700 transition-all duration-300">
                    <FaHome className="mr-3" /> Dashboard
                </a>
                <a href="/attendance-history" className="flex items-center p-4 hover:bg-blue-700 transition-all duration-300">
                    <FaHistory className="mr-3" /> Attendance History
                </a>
                <a href="/submit-form" className="flex items-center p-4 hover:bg-blue-700 transition-all duration-300">
                    <FaFileAlt className="mr-3" /> Submit Form
                </a>
            </nav>
            <button
                onClick={handleLogout}
                className="flex items-center p-4 border-t border-blue-700 hover:bg-blue-700 transition-all duration-300"
            >
                <FaSignOutAlt className="mr-3" /> Logout
            </button>
        </div>
    );
};

export default Sidebar;