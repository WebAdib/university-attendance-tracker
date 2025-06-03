import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import AttendanceHistory from './pages/AttendanceHistory';
import SubmitForm from './pages/SubmitForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance-history" element={<AttendanceHistory />} />
        <Route path="/submit-form" element={<SubmitForm />} />
      </Routes>
    </Router>
  );
}

export default App;