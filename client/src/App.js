import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import { useState } from "react";

import toast, { Toaster } from "react-hot-toast";

/** Liest den Wert des Cookies raus, wenn kein Cookie kommt ein leerer String zurück*/
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function App() {
  const [loggedIn, setLoggedIn] = useState(sessionCheck());
  const [chatRooms, setChatRooms] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  /** Überprüft die Sitzung */
  function sessionCheck() {
    var cookieValue = getCookie("loggedIn");
    return cookieValue;
  }

  useEffect(() => {
    if (loggedIn) {
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
        socket.disconnect();
      };
    } else {
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
      /** Benachrichtigungsfenster UI */
      toast(message.from + ": " + message.content, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    });

    socket.on("initChats", ({ users, chatRooms, onlineUsers }) => {
      setMatchedUsers(users);
      setChatRooms(chatRooms);
      setOnlineUsers(new Set(onlineUsers));
    });

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

    socket.on("userConnected", (userID) => {
      setOnlineUsers((onlineUsers) => {
        return new Set([...onlineUsers, userID]);
      });
    });

    socket.on("userDisconnected", (userID) => {
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
      socket.off("userConnected");
      socket.off("userDisconnected");
    };
  }, []);

  async function getUser() {
    return fetch("/getUser")
      .then((response) => response.json())
      .then((data) => {
        //data ist das was der Server aus der DB zurückgibt
        console.log(data);
        return data; //returned von der fetch Funktion den ganzen User
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
