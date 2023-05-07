import React from 'react'

export default function ChatMessage({ sender, text }) {
  return (
    <div>
      <div>
        Absender {sender}
        <img src="" alt="" />
      </div>
      <div>
        message {text}
      </div>
      <div>
        Timestamp
      </div>
    </div>
  )
}
