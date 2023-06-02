import React, { useState } from 'react'
import Chat from './Chat';
import Navbar from '../components/navbar';


export default function ChatUserList({ chatMessages, matchedUsers }) {
    const [selectedUser, setSelectedUser] = useState(null);


    var selectedUserMessages = chatMessages.filter((message) => message.receiverId === selectedUser?.userId); // filtert alle Nachrichten, die an den ausgewählten User gesendet wurden

    if (selectedUser) { // wenn ein user ausgewählt wurde, dann wird der Chat gerendert
        return (
            <>
                <Navbar></Navbar>
                <button onClick={() => setSelectedUser(null)}>Back</button>	
                <Chat chatMessages={selectedUserMessages} receiver={selectedUser}></Chat>
            </>
        )
    }

    return ( // wenn kein user ausgewählt wurde, dann wird die Liste der User gerendert
        <>
            <Navbar></Navbar>
            <div>ChatUserList</div>
            {matchedUsers.map((user, index) => (
                <div key={index}>
                    <button onClick={() => setSelectedUser(user)}>{user.username}</button>
                </div>
            ))}
        </>
    )
}
