import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import "./chat.css";
import ChatMessage from '../components/ChatMessage';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState({ userId: null, username: null });
  const [receiver, setReceiver] = useState(null);

  const socketRef = useRef();

  const checkIfUserExists = useCallback(() => {
    const sessionID = localStorage.getItem('sessionID');
    if (sessionID) {
      socketRef.current.auth = { sessionID };
      socketRef.current.connect();
    }
  }, [socketRef]);

  useEffect(() => {

    socketRef.current = io("http://localhost:3001", { autoConnect: false });

    getUsername().then((username) => { //wenn der Username gesetzt wurde, wird der Socket verbunden
      console.log(username);
      socketRef.current.auth = { username };
      socketRef.current.connect();
    });

    console.log(socketRef.current);
    socketRef.current.on('message', (message) => {
      // if (message.sender === user.userId || message.sender === receiver) {
      setMessages((prevMessages) => [...prevMessages, message]);
      // }
    });

    checkIfUserExists();

    socketRef.current.on('session', ({ sessionId, userId, username }) => {
      socketRef.current.auth = { sessionId: sessionId };
      localStorage.setItem('sessionID', sessionId);
      console.log("sessionID: " + sessionId);
      setUser({ userId: userId, username });
    });

    socketRef.current.on('User disconnected', () => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Server", text: "User disconnected" }
      ]);
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

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    socketRef.current.emit('message', inputValue);
    setInputValue('');
  };

  console.log("rerender");
  console.log(messages);

  async function getUsername() {
      return fetch('http://localhost:3001/getUsername', { //get Anfrage an den Server um den Usernamen zu bekommen
      }).then(response => response.json()).then(data => { //data ist das was der Server zurückgibt, also den Beispielnamen Max
        console.log(data);
        setUser({ userId: data.userId, username: data.name }); //setzt den Usernamen in den State
        return data.name; //returned von der fetch Funktion den Usernamen
      }
      );
  }

  return (
    <>
      <div className="chatBox">
        <div id="messages">
          {messages.map((message) => (
            <div key={message.id}>
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