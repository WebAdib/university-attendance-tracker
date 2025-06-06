import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const FormFillUp = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [file, setFile] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await api.get('/students/submit-form/status', {
                    headers: { Authorization: `Bearer ${getAuthToken()}` },
                });
                setSubmissions(response.data);
            } catch (err) {
                setError('Failed to fetch submissions');
            }
        };
        fetchSubmissions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a PDF file');
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
            setError(err.response?.data?.message || 'Failed to set form fill-up');
            setMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Form Fill-up</h1>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                        >
                            Set Form Fill-up
                        </button>
                    </form>
                    <h2 className="text-xl font-semibold mb-4">Submitted Forms</h2>
                    <ul className="space-y-2">
                        {submissions.map(sub => (
                            <li key={sub._id} className="border-b pb-2">{sub.email} - {sub.comments}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FormFillUp;
