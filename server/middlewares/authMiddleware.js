const jwt = require('jsonwebtoken');

// Verify JWT token
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if Authorization header exists and is in the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token or invalid token format, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info (e.g., userId, role)
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message); // Log for debugging
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Role-based access control
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};