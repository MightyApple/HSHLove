import React from 'react';
import './chatMessage.css';

export default function ChatMessage({ sender, text, timestamp, isImage }) {
  return (
    <div>
        {/*<div>
        Absender {sender}
        <img src="" alt="" className="profileImg" width="" height="" />
      </div>*/}
      <div className="message">
        {isImage ? <img src={text} alt="" className="messageImg" width="200" height="200" /> : text}
      </div>
        {/*<div>
        {timestamp}
      </div>*/}
    </div>
  )
}
