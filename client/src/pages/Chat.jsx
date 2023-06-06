import { useState, useEffect } from 'react';
import "./chat.css";
import ChatMessage from '../components/ChatMessage';
import ProfilePicture from '../components/profilePicture'

import { socket } from '../components/socket';


export default function Chat({ chatMessages, receiver }) {
  const [inputValue, setInputValue] = useState('');

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

  useEffect(() => {
    // nach unten scrollen
    window.scrollTo(0, document.body.scrollHeight);
  }, [chatMessages.length]);

  return (
    <>
      <div className="chatBox">
        <div id="messages">
          {chatMessages.map((message, index) => (
              <div key={index} className={message.sender === receiver.userId ? 'receiver-message' : 'sender-message'}>
                <ProfilePicture profileImage={message.receiverImage}></ProfilePicture>
                <div className={"messageContent"}>
                  <ChatMessage sender={message.sender} text={message.content} timestamp={message.timestamp} />
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
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}