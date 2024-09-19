import React from 'react'


import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../Pages/Login';
import Dashboard from '../Pages/Dashboard';
import Home from '../Pages/Protected/Home';
import Users from '../Pages/Protected/Users';
import Bikes from '../Pages/Protected/Bikes';
import CreateNewUser from '../Pages/Protected/CreateNewUser';
import CreateNewBike from '../Pages/Protected/CreateNewBike';
import UpdateDeleteUser from '../Pages/Protected/UpdateDeleteUser';
import UpdateDeleteBike from '../Pages/Protected/UpdateDeleteBike';
// Function to get the access token from cookies
// const getAccessToken = () => {
//     return Cookies.get('accessToken');
// }

// Function to check if the user is authenticated
const isAuthenticated = () => {
    const token = localStorage.getItem('AccessToken');
    let AccessToken = localStorage.getItem("AccessToken");
    return !!token;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
    {
        element: <ProtectedRoute isAuthenticated={isAuthenticated()} />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
                children: [
                    {
                        path: '/dashboard/home',
                        element: <Home />
                    },
                    {
                        path: '/dashboard/users',
                        element: <Users />
                    },
                    {
                        path: '/dashboard/bikes',
                        element: <Bikes />
                    },
                    {
                        path: '/dashboard/createNewUser',
                        element: <CreateNewUser />
                    },
                    {
                        path: '/dashboard/createNewBike',
                        element: <CreateNewBike />
                    },
                    {
                        path: '/dashboard/updateDeleteUser',
                        element: <UpdateDeleteUser />
                    },
                    {
                        path: '/dashboard/updateDeleteBike',
                        element: <UpdateDeleteBike />
                    },
                  ],
            },
          
            
        ]
    },
    {
        path: '*',
        element: <p>404 Error - Nothing here...</p>
    }
]);

export default router;