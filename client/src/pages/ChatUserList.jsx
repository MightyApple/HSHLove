import React, { useState } from 'react'
import Chat from './Chat';
import Navbar from '../components/navbar';


export default function ChatUserList({ chatMessages, onlineUsers }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([ // TODO: DB Abfrage ob Match vorhanden ist, wenn ja dann wird der User in die Liste eingefügt
        { userId: 1, username: "Max" },
        { userId: 2, username: "Moritz" },
        { userId: 3, username: "Peter" },
        { userId: 4, username: "Hans" },
    ]);
    
    fetch ('/getUserMatches').then(response => response.json()).then(data => { //data ist das was der Server zurückgibt, also den Beispielnamen Max
        console.log(data);
        return data; //returned von der fetch Funktion den Usernamen
        }
        );

    if (selectedUser) { // wenn ein user ausgewählt wurde, dann wird der Chat gerendert
        return (
            <>
                <Navbar></Navbar>
                <button onClick={() => setSelectedUser(null)}>Back</button>	
                <Chat chatMessages={chatMessages} receiver={selectedUser}></Chat>
            </>
        )
    }

    return ( // wenn kein user ausgewählt wurde, dann wird die Liste der User gerendert
        <>
            <Navbar></Navbar>
            <div>ChatUserList</div>
            {users.map((user, index) => (
                <div key={index}>
                    <button onClick={() => setSelectedUser(user)}>{user.username}</button>
                </div>
            ))}
        </>
    )
}
