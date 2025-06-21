import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const MyDetails = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Details</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                            <input
                                type="text"
                                value="[Placeholder]"
                                readOnly
                                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                value="[Placeholder]"
                                readOnly
                                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                            <input
                                type="text"
                                value="[Placeholder]"
                                readOnly
                                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Address</label>
                            <input
                                type="text"
                                value="[Placeholder]"
                                readOnly
                                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Department</label>
                            <input
                                type="text"
                                value="[Placeholder]"
                                readOnly
                                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Designation</label>
                            <input
                                type="text"
                                value="[Placeholder]"
                                readOnly
                                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyDetails;