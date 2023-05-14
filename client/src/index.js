import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import './index.css'; //TODO kann raus geworfen werden, wenn niemand das braucht
import './reset.css';
import './global.css';


import StartingPage from './pages/startingPage'
import Login from './pages/login';
import Register from './pages/register';
import EditProfile from './pages/editProfile'
import Chat from './pages/Chat';
import reportWebVitals from './reportWebVitals';
import DebugRouter from './pages/debugRouter';
import ErrorPage from "./error-page";



const router = createBrowserRouter([
    {
        path: "/",
        element: <DebugRouter />,
        
        errorElement: <ErrorPage />,
    },
    // Ganz neue Seite
    {
        path: "chat",
        element: <Chat />,
    },
    {
        path: "login",
        element: <Login />,
    },
    {
        path: "registrieren",
        element: <Register />,
    },
    {
        path: "start",
        element: <StartingPage />,
    },
    {
        path: "edit",
        element: <EditProfile />,
    },
    
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();