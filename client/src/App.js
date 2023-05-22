import React, { useEffect } from 'react';
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
import DebugRouter from './pages/debugRouter';
import ErrorPage from "./error-page";

import { socket } from './components/socket';
import { useState } from 'react';

function App() {
    const [loggedIn, setLoggedIn] = useState(false); //TODO: muss mit session/cookie synchronisiert werden

    const [chatMessages, setChatMessages] = useState([]);
    const [matchedUsers, setMatchedUsers] = useState([]);

    useEffect(() => { // wird einmal ausgeführt
        if (loggedIn) { // wenn der user eingeloggt ist
            getUser().then((user) => { // holt sich den ganzen user (also alle db Einträge)
                if (!user) { 
                    console.log("no user"); 
                    return; 
                }
                console.log(user); 
                socket.auth = user; 
                socket.connect(); 
            });

            return () => {
                socket.disconnect();
            }
        } else {
            socket.disconnect();
        }
    }, [loggedIn]);

    useEffect(() => { // wird einmal ausgeführt
        socket.on("message", (message) => {
            console.log("message received: " + message + " from " + socket.id);
            setChatMessages((chatMessages) => [...chatMessages, message]);
        });

        socket.on("initChats", ({users, messages}) => {
            setMatchedUsers(users);
            console.log(messages);
            setChatMessages(messages);
        });

    
        // socket.on("User connected", (user) => {
        //     console.log("User connected: " + user);
        //     setOnlineUsers((onlineUsers) => [...onlineUsers, user]);
        // });
    
        // socket.on("User disconnected", (user) => { //wird ausgeführt, wenn ein client disconnected
        //     console.log("User disconnected: " + user); 
        //     setOnlineUsers((onlineUsers) => onlineUsers.filter((u) => u !== user)); // entfernt den user aus der Liste von onlineUsers
        // });

        return () => {
            socket.off("message");
            socket.off("initChats");
            // socket.off("User connected");
            // socket.off("User disconnected");
        }
    }, []);

    async function getUser() {
        return fetch('/getUser').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
            console.log(data);
            return data; //returned von der fetch Funktion den ganzen User
        }
        );
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: <DebugRouter />,

            errorElement: <ErrorPage />,
        },
        // Ganz neue Seite
        // ChatUserList bekommt die chatMessages und onlineUsers als props übergeben
        {
            path: "chat",
            element: <ChatUserList chatMessages={chatMessages} matchedUsers={matchedUsers} />,
        },
        {
        // Brauche Info, ob User eingeloggt ist, damit wir connecten können
            path: "login",
            element: <Login setLoggedIn={setLoggedIn} />,
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

    console.log("loggedIn: " + loggedIn);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
