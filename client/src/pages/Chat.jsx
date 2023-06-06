import { useState, useEffect } from 'react';
import "./chat.css";
import ChatMessage from '../components/ChatMessage';
import ProfilePicture from '../components/profilePicture'

import { socket } from '../components/socket';


export default function Chat({ chatMessages, receiver }) {
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState({ userId: null, username: null });

  function handleSubmit(event) {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    // socketRef.current.emit('message', inputValue);
    socket.emit("message", {
      content: inputValue,
      to: receiver.userId,
    },);
    // this.selectedUser.messages.push({
    //   content,
    //   fromSelf: true,
    // });

    setInputValue('');
  }

  useEffect(() => {
    console.log("Receiver")
    console.log(receiver.userId)
    console.log(chatMessages)
    // nach unten scrollen
    window.scrollTo(0, document.body.scrollHeight);
  }, [chatMessages]);

  return (
    <>
      <div className="chatBox">
        <div id="messages">
          {chatMessages.map((message, index) => (
              <div key={index} className={message.sender === receiver.userId ? 'receiver-message' : 'sender-message'}>
                <ProfilePicture profileImage={message.receiverImage}></ProfilePicture>
                <div className={"messageContent"}>
                  <ChatMessage sender={message.from} text={message.content} timestamp={message.timestamp} />
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