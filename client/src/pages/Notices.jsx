import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import { FaBell } from 'react-icons/fa';

const Notices = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role !== 'student') {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Notices</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center space-x-4">
                            <FaBell className="text-4xl text-yellow-600" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Notice 1</h2>
                                <p className="text-gray-600">Placeholder notice content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center space-x-4">
                            <FaBell className="text-4xl text-yellow-600" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Notice 2</h2>
                                <p className="text-gray-600">Placeholder notice content.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notices;