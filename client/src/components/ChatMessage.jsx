import React from 'react';
import './chatMessage.css';

export default function ChatMessage({ sender, text, timestamp, isImage }) {
  let preText="https://storage.googleapis.com/chatbilder/"
  return (
    <div>
        {}
      <div className="message">
        {isImage ? <img src={preText+text} alt="" className="messageImg" width="200" height="200" /> : text}
      </div>
        {}
    </div>
  )
}
