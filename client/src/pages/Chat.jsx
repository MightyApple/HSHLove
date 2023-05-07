import { useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import "./chat.css";
import ChatMessage from '../components/ChatMessage';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:3001", { autoConnect: true }); // { autoConnect: false } in Zukunft
    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
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
        {  sender: "Server", text: "User connected" }
      ]);
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

  return (
    <>
      <ul id="messages">
        {messages.map((message) => (
          <li key={message.id}>
            <ChatMessage sender={message.sender} text={message.text} />
          </li>
        ))}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          autoComplete="off"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
  