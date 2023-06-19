import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";

import "./reset.css";
import "./global.css";

import StartingPage from "./pages/startingPage";
import Login from "./pages/login";
import Register from "./pages/register";
import EditProfile from "./pages/editProfile";
import ChatUserList from "./pages/ChatUserList";
//import DebugRouter from './pages/debugRouter';
import ErrorPage from "./error-page";
import MatchPage from "./pages/matchPage";
import Admin from "./pages/admin";
import LoadingScreen from "./components/loadingScreen";
import NutzerSuchen from "./pages/nutzerSuchen";
import Gemeldet from "./pages/gemeldet";
import Kontakt from "./pages/kontakt";
import Nutzerbedingungen from "./pages/nutzerbedingungen";
import Datenschutz from "./pages/datenschutz";

import { socket } from "./components/socket";
import toast, { Toaster } from "react-hot-toast";

import LoginContext from "./components/LoginProvider";

function App() {
  const [chatRooms, setChatRooms] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { loggedIn, setLoggedIn } = React.useContext(LoginContext);

  /** wenn sich der User einloggt wird er mit dem socket verbunden */
  useEffect(() => {
    console.log("useEffect loggedIn: " + loggedIn);
    if (loggedIn) {
      console.log("Getting user...");
      getUser().then((user) => {
        if (!user) {
          console.log("no user");
          return;
        }
        console.log(user);
        socket.auth = user;
        socket.connect();
      });

      return () => {
        console.log("disconnecting socket");
        socket.disconnect();
      };
    } else {
      console.log("disconnecting socket");
      socket.disconnect();
    }
  }, [loggedIn]);

  useEffect(() => {
    /** wenn User Nachricht erhält, wird der chatroom gesucht zu dem die message gehört, dann wird die message zum chatroom hinzugefügt.*/
    socket.on("message", (message) => {
      setChatRooms((chatRooms) => {
        var { chatID, ...chatMessage } = message;
        var updatedChatRoom = chatRooms.find(
          (chatRoom) => chatRoom.id === chatID
        );
        updatedChatRoom.messages.push(chatMessage);
        return [...chatRooms, updatedChatRoom];
      });

      /** keine Benachrichtigung wenn der sender der aktuelle user ist*/
      if (message.sender === socket.auth.username) {
        return;
      }
      /** kein Benachrichtigung wenn wir uns bereits in einem Chat befinden*/
      if (window.location.pathname === "/chat") {
        return;
      }
      /** Benachrichtigungsfenster für messages */
      toast(message.from + ": " + message.content, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    });

    /** initialisiert und aktualisiert die Chats*/
    socket.on("initChats", ({ users, chatRooms, onlineUsers }) => {
      setMatchedUsers(users);
      setChatRooms(chatRooms);
      setOnlineUsers(new Set(onlineUsers));
    });

    /** wenn ein Match ausgelöst wird, wird ein neuer Chatroom erstellt und eine Benachrichtigung an die user geschickt*/
    socket.on("newMatch", (data) => {
      var user = data.user;
      var chatRoom = data.chatRoom;
      setMatchedUsers((matchedUsers) => [...matchedUsers, user]);
      setChatRooms((chatRooms) => [...chatRooms, chatRoom]);

      toast("Neuer Match: " + user.username, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    });

    /** wenn user connecten, dann werden sie in das Set onlineUser hinzugefügt */
    socket.on("User connected", (userID) => {
      setOnlineUsers((onlineUsers) => {
        return new Set([...onlineUsers, userID]);
      });
    });

    /** wenn user disconnecten, dann werden sie aus dem onlineUser Set entfernt */
    socket.on("User disconnected", (userID) => {
      setOnlineUsers((onlineUsers) => {
        var newOnlineUsers = new Set(onlineUsers);
        newOnlineUsers.delete(userID);
        return newOnlineUsers;
      });
    });

    return () => {
      socket.off("message");
      socket.off("initChats");
      socket.off("newMatch");
      socket.off("User connected");
      socket.off("User disconnected");
    };
  }, []);

  /** holt das ganze user object aus der db */
  async function getUser() {
    return fetch("/getUser")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      });
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <StartingPage />,

      errorElement: <ErrorPage />,
    },
    // Ganz neue Seite
    {
      path: "chat",
      element: (
        <ChatUserList
          chatRooms={chatRooms}
          matchedUsers={matchedUsers}
          onlineUsers={onlineUsers}
        />
      ),
    },
    {
      path: "login",
      element: <Login setLoggedIn={setLoggedIn} />,
    },
    {
      path: "registrieren",
      element: <Register />,
    },
    /*{
            path: "debug",
            element: <DebugRouter />,
        },
         */
    {
      path: "edit",
      element: <EditProfile />,
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
      path: "impressum",
      element: <Kontakt />,
    },
    {
      path: "nutzerbedingungen",
      element: <Nutzerbedingungen />,
    },
    {
      path: "datenschutz",
      element: <Datenschutz />,
    },
    {
      path: "loading",
      element: <LoadingScreen />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" duration={5000} />
    </>
  );
}

export default App;
