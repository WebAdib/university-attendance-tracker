import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import { FaFileAlt, FaDownload } from 'react-icons/fa';
import api from '../services/api';

const SubmitForm = () => {
    const [formDetails, setFormDetails] = useState(null);
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
        if (decoded.role !== 'student') {
            navigate('/');
            return;
        }

        // Fetch the latest form details
        const fetchFormDetails = async () => {
            try {
                const response = await api.get('/form-fill-up/latest', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormDetails(response.data);
            } catch (err) {
                setError('Failed to fetch form details');
            }
        };
        fetchFormDetails();
    }, [navigate]);

    const handleDownload = async () => {
    if (!formDetails?.file) {
        setError('No file available for download');
        return;
    }

    try {
        console.log('Starting download for:', formDetails.file);
        const response = await api.get(`/form-fill-up/download/${encodeURIComponent(formDetails.file)}`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
            responseType: 'blob', // Important for file download
        });
        console.log('Download response status:', response.status);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', formDetails.file.split('/').pop() || 'form.pdf'); // Extract filename
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setMessage('File downloaded successfully');
        setError('');
        console.log('Download completed');
    } 
    catch (err) {
        console.error('Download error:', err);
        //setError('Failed to download file');
        setMessage('');
    }
};

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Submit Form</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center space-x-4">
                            <FaFileAlt className="text-4xl text-green-600" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Form Details</h2>
                                {formDetails ? (
                                    <div className="space-y-2 mt-2">
                                        <p className="text-gray-600">Start Date: {new Date(formDetails.startDate).toLocaleDateString()}</p>
                                        <p className="text-gray-600">End Date: {new Date(formDetails.endDate).toLocaleDateString()}</p>
                                        <p className="text-gray-600">File: {formDetails.file.split('-').pop() || 'N/A'}</p>
                                        <button
                                            onClick={handleDownload}
                                            className="mt-4 flex items-center bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                                        >
                                            <FaDownload className="mr-2" /> Download PDF
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Loading form details...</p>
                                )}
                                {message && <p className="text-green-600 mt-2">{message}</p>}
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitForm;