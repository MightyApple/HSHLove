import {useState, useEffect, useRef} from 'react';
import "./chat.css";
import ChatMessage from '../components/ChatMessage';
import ProfilePicture from '../components/profilePicture'

import { socket } from '../components/socket';


export default function Chat({ chatMessages, receiver }) {
  const [inputValue, setInputValue] = useState('');

  const scrollableDivRef = useRef(null);

  /* Funktion zum Senden der Nachrichten*/
  function handleSubmit(event) {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    socket.emit("message", {
      content: inputValue,
      to: receiver.userId,
    },);
/* Nach dem Senden wird das Inputfeld geleert*/
    setInputValue('');
  }

  function handleImageChange(event) {
    var file = event.target.files[0];

    if(!file) {
      return;
    }

    // erstellt ein FormData Objekt und fügt das Bild hinzu
    const data = new FormData();
    data.append('image', file, file.name);
    
    // sendet das Bild an den Server
    fetch('/uploadImage', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.text)
        socket.emit("imgMessage", {
          content: data.text,
          to: receiver.userId,
        },);
        setInputValue('');
      })
      .catch((err) => console.error(err));


  }

  useEffect(() => {
    /* Scrollt automatisch nach unten beim Neuladen*/
    window.scrollTo(0, document.body.scrollHeight);

    /* Scrollt automatisch nach unten, wenn eine neue Nachricht gesendet wird*/
    scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
  }, [chatMessages.length,inputValue]);

  return ( 
    <>
      <div className="chatBox" ref={scrollableDivRef}>
        /* Container für die Nachrichten*/
        <div id="messages">
          /* Durchläuft alle Nachrichten und rendert*/
          {chatMessages.map((message, index) => (
              <div key={index} className={message.sender === receiver.userId ? 'receiver-message' : 'sender-message'}>
                /* Profilbild des Absenders wird angezeigt*/
                <ProfilePicture profileImage={message.receiverImage}></ProfilePicture>
                <div className={"messageContent"}>
                  /* rendert die Nachricht*/
                  <ChatMessage sender={message.sender} text={message.content} timestamp={message.timestamp} isImage={message.isImage} />
                </div>
              </div>
          ))}
        </div>
        <form id="form" onSubmit={handleSubmit}>
          /* Inputfeld für die Nachrichten*/
          <input
            id="input"
            autoComplete="off"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          /* Label für das Bild upload*/
          <label htmlFor="image-input" className="image-input-label" style={{
            cursor: "pointer",
            fontSize: "1.5rem",
            padding: "0 0.5rem",

            color: "#fff",
            backgroundColor: "#333",
            borderRadius: "10%",
          //* Emoji Symbol*/
          }}>&#128206;</label>
          <input id='image-input' type="file" onChange={handleImageChange} accept='image/*' style={{
            display: "none"
          }} />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}