import React from 'react'

export default function ChatMessage({ absender, text }) {
  return (
    <div>
      <div>
        Absender {absender}
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
