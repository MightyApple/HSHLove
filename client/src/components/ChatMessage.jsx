import React from 'react'

const today = new Date(); //TODO Test Zeiten entfernen (die sind nur da, damit ich stylen kann)
const time = today.toLocaleTimeString();
const date = today.toLocaleDateString();

export default function ChatMessage({ sender, text }) {
  return (
    <div>
      <div>
        Absender {sender}
        <img src="" alt="" className="profileImg" width="" height="" />
      </div>
      <div className="message">
        {text}
      </div>
      <div>
        {time}
      </div>
    </div>
  )
}
