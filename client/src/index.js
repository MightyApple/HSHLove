import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import './index.css'; //TODO kann raus geworfen werden, wenn niemand das braucht
import './reset.css'
import './global.css'

import App from './pages/App';
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
        path: "homepage",
        element: <App />,
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