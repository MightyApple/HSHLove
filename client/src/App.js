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
import ErrorPage from './error-page';
import MatchPage from './pages/matchPage'
import Admin from './pages/admin'
import LoadingScreen from './components/loadingScreen'
import NutzerSuchen from './pages/nutzerSuchen'
import Gemeldet from './pages/gemeldet'
import Desktop from './pages/desktop'

import { socket } from './components/socket';
import { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function App() {
    const [loggedIn, setLoggedIn] = useState(sessionCheck()); //TODO: muss mit session/cookie synchronisiert werden

    const [chatRooms, setChatRooms] = useState([]);
    const [matchedUsers, setMatchedUsers] = useState([]);

    function sessionCheck() {
        var cookieValue = getCookie("loggedIn");
        return cookieValue;
    }

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
            //console.log("message received: " + JSON.stringify(message) + " from " + socket.id);
            setChatRooms((chatRooms) => {
                var { chatID, ...chatMessage } = message;
                var updatedChatRoom = chatRooms.find((chatRoom) => chatRoom.id === chatID);
                updatedChatRoom.messages.push(chatMessage);
                return [...chatRooms, updatedChatRoom];
            });

            // kein toast wenn der sender der aktuelle user ist
            if(message.sender === socket.auth.username) {
                return;
            }
            // kein toast wenn wir uns bereits in einem Chat befinden
            if (window.location.pathname === "/chat") {
                return;
            }

            toast(message.from + ": " + message.content, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })

        });

        socket.on("initChats", ({users, chatRooms}) => {
            setMatchedUsers(users);
            console.log(chatRooms);
            setChatRooms(chatRooms);
        });

        socket.on("newMatch", (data) => {
            var user = data.user;
            var chatRoom = data.chatRoom;
            setMatchedUsers((matchedUsers) => [...matchedUsers, user]);
            setChatRooms((chatRooms) => [...chatRooms, chatRoom]);

            toast("Neuer Match: " + user.username, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
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
            element: <StartingPage />,

            errorElement: <ErrorPage />,
        },
        // Ganz neue Seite
        // ChatUserList bekommt die chatMessages und onlineUsers als props übergeben
        {
            path: "chat",
            element: <ChatUserList chatRooms={chatRooms} matchedUsers={matchedUsers} />,
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
            path: "debug",
            element: <DebugRouter />,
        },
        {
            path: "edit",
            element: <EditProfile  />,
        },
        {
            path: "match",
            element: <MatchPage />,
        },
        {
            path: "admin",
            element: <Admin />,
        },
        {
            path: "nutzer",
            element: <NutzerSuchen />,
        },
        {
            path: "gemeldet",
            element: <Gemeldet />,
        },
        {
            path: "desktop",
            element: <Desktop />,
        },
        {
            path: "loading",
            element: <LoadingScreen />,
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
            <Toaster
                position="top-center"
                duration={5000}
            />
        </>
    );
}

export default App;
