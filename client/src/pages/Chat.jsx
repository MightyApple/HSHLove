import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import "./chat.css";
import ChatMessage from '../components/ChatMessage';
// import Navbar from '../components/navbar'
import ChatUserList from './ChatUserList';

export default function Chat({ receiver }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState({ userId: null, username: null });


  const socketRef = useRef();
  const token = "token123";

  // const checkIfUserExists = useCallback(() => {
  //   const sessionId = localStorage.getItem('sessionId');
  //   if (sessionId) {
  //     if (socketRef.current.auth) {
  //       socketRef.current.auth.sessionId = sessionId
  //     } else {
  //       socketRef.current.auth = { sessionId };
  //     }
  //     socketRef.current.connect();
  //   }
  // }, [socketRef]);

  useEffect(() => {

    socketRef.current = io("http://localhost:3001", { autoConnect: false });



    getUser().then((user) => {
      if (!user) {
        console.log("no user");
        return;
      }
      console.log(user);
      socketRef.current.auth = {
        ...user,
        receiver: receiver.userId,
      };
      socketRef.current.connect();
    });

    console.log(socketRef.current);

    socketRef.current.on('message', ({ userId, username, text }) => {
      const newMessage = {
        type: "message",
        userId,
        sender: userId,
        text
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketRef.current.on("private message", ({ content, from, to }) => {
      console.log("private message received from " + from + " to " + to);
      const newMessage = {
        type: "message",
        userId: to,
        sender: from,
        text: content
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // checkIfUserExists();

    socketRef.current.on('session', ({ sessionId, userId: userID, username }) => {
      socketRef.current.auth.sessionId = sessionId;
      localStorage.setItem('sessionId', sessionId);
      console.log("sessionId: " + sessionId);
      // setUser({ userId: userID, username });
      socketRef.current.userID = userID;
    });

    socketRef.current.on('User disconnected', () => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Server", text: "User disconnected" }
      ]);
    });

    socketRef.current.on("users", (users) => {
      const messagesArr = [];
      for (const { userId, username } of users) {
        const newMessage = { type: "userStatus", userId, username };
        messagesArr.push(newMessage);
      }
      setMessages([...messages, ...messagesArr]);
    });

    socketRef.current.on('User connected', () => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Server", text: "User connected" }
      ]);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log(err instanceof Error);
      console.log(err.message);
      console.log(err.data);
    });

    socketRef.current.onAny((event, ...args) => {
      console.log(event, args);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    // socketRef.current.emit('message', inputValue);
    socketRef.current.emit("private message", {
      content: inputValue,
      to: receiver.userId,
    });
    // this.selectedUser.messages.push({
    //   content,
    //   fromSelf: true,
    // });

    setInputValue('');
  };

  console.log("rerender");
  console.log(messages);

  async function getUser() {
    return fetch('/getUser').then(response => response.json()).then(data => { //data ist das was der Server zurückgibt, also den Beispielnamen Max
      console.log(data);
      return data; //returned von der fetch Funktion den Usernamen
    }
    );
  }



  return (
    <>

      <div className="chatBox">
        <div id="messages">
          {messages.map((message, index) => ( //geht über alle messages und rendert
            <div key={index}>
              <ChatMessage sender={message.sender} text={message.text} />

            </div>
          ))}
        </div>
        <form id="form" onSubmit={handleSubmit}>
          <input
            id="input"
            autoComplete="off"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}