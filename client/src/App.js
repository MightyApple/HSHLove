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
import ChatUserList from './pages/ChatUserList';
import Chat from './pages/Chat';
import reportWebVitals from './reportWebVitals';
import DebugRouter from './pages/debugRouter';
import ErrorPage from "./error-page";

import { socket } from './components/socket';
import { useState } from 'react';

const router = createBrowserRouter([
    {
        path: "/",
        element: <DebugRouter />,
        
        errorElement: <ErrorPage />,
    },
    // Ganz neue Seite
    {
        path: "chat",
        element: <ChatUserList />,
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

function App() {
  return (
    <>
        <RouterProvider router={router} />
    </>
  );
}

export default App;
