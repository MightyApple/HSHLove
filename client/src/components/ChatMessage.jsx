import React from 'react'

export default function ChatMessage({ sender, text, timestamp }) {
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
        {timestamp}
      </div>
    </div>
  )
}
