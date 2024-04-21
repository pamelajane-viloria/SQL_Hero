import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('authToken');

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default PrivateRoute;

// import { Navigate, useLocation } from 'react-router-dom';
// import jwt_decode from 'jwt-decode'; // Library to decode JWT

// function PrivateRoute({ children }) {
//   const location = useLocation();
//   const authToken = localStorage.getItem('authToken');

//   // Check for token and its validity (optional)
//   if (!authToken) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   try {
//     const decoded = jwt_decode(authToken);
//     const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

//     if (decoded.exp < currentTime) {
//       // Token expired, handle re-authentication
//       console.warn('Token expired!');
//       localStorage.removeItem('authToken'); // Remove expired token
//       return <Navigate to="/login" replace state={{ from: location }} />;
//     }

//     // Valid token, allow access
//     return children;
//   } catch (err) {
//     console.error('Invalid token:', err);
//     localStorage.removeItem('authToken'); // Remove invalid token
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }
// }

// export default PrivateRoute;
