import { useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import "./chat.css";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
  
    const socketRef = useRef();
  
    useEffect(() => { //Eventlistener, der clientseitig eingehende Nachrichten empfängt
      socketRef.current = io("http://localhost:3001");
  
      socketRef.current.on('message', (message) => { //ändert den Status
        setMessages((prevMessages) => [...prevMessages, message]); //... entpackt den Wert aus einem Array Besipiel: a[1,2,3,...[4]] => a[1,2,3,4]
      });

     // socketRef.current.on("connect", () => {
     //   console.log(socket.id); 
     // });

      return () => {
        socketRef.current.disconnect(); //wenn chat.js beendet wird
      };
    }, []);
  
    function handleSubmit(event){
      event.preventDefault();
      if (!inputValue.trim()) {
        return;
      }
  
      socketRef.current.emit('message', inputValue); //schickt Nachricht ab
      setInputValue(''); //leert das Textfeld wieder
    };
  
    console.log("rerender");
    console.log(messages);
    return (
      <>
        <ul id="messages">
          {messages.map((message, index) => (
           <li key={index}>{message}</li> //react kann durch keys feststellen was neu gerendert werden muss
          ))}
        </ul>
        <form id="form" onSubmit={handleSubmit}>
          <input id="input" autoComplete="off" value={inputValue} onChange={(event) => setInputValue(event.target.value)}//aktualisert den Wert von InputValue
          />
          <button type="submit">Send</button>
        </form>
      </>
    );
  }
  