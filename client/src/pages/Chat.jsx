import {useState, useEffect, useRef} from 'react';
import "./chat.css";
import ChatMessage from '../components/ChatMessage';
import ProfilePicture from '../components/profilePicture'

import { socket } from '../components/socket';


export default function Chat({ chatMessages, receiver }) {
  const [inputValue, setInputValue] = useState('');

  const scrollableDivRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    socket.emit("message", {
      content: inputValue,
      to: receiver.userId,
    },);

    setInputValue('');
  }

  function handleImageChange(event) {
    var file = event.target.files[0];

    if(!file) {
      return;
    }

    // 👇 Create new FormData object and append files
    const data = new FormData();
    data.append('image', file, file.name);

    console.log('sending image');
    // 👇 Uploading the file using the fetch API to the server
    fetch('/uploadImage', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));


  }

  useEffect(() => {
    // nach unten scrollen
    window.scrollTo(0, document.body.scrollHeight);

    scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
  }, [chatMessages.length]);

  return (
    <>
      <div className="chatBox" ref={scrollableDivRef}>
        <div id="messages">
          {chatMessages.map((message, index) => (
              <div key={index} className={message.sender === receiver.userId ? 'receiver-message' : 'sender-message'}>
                <ProfilePicture profileImage={message.receiverImage}></ProfilePicture>
                <div className={"messageContent"}>
                  <ChatMessage sender={message.sender} text={message.content} timestamp={message.timestamp} isImage={message.isImage} />
                </div>
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
          <label htmlFor="image-input" className="image-input-label" style={{
            cursor: "pointer",
            fontSize: "1.5rem",
            padding: "0 0.5rem",

            color: "#fff",
            backgroundColor: "#333",
            borderRadius: "10%",

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