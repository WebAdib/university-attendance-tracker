import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const FormFillUp = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate('/');
            return;
        }

        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.role !== 'admin') {
            navigate('/');
            return;
        }
    }, [navigate]);

    const handleReleaseForm = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a PDF file');
            return;
        }
        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);

        try {
            const response = await api.post('/form-fill-up', formData, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            setError('');
            setFile(null);
            setStartDate('');
            setEndDate('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to release form');
            setMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Release Form for Fill-up</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleReleaseForm} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Upload Form (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                        >
                            Release Form
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormFillUp;