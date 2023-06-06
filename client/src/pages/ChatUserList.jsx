import React, { useMemo, useState } from 'react'
import Chat from './Chat';
import Navbar from '../components/navbar';
import "./ChatUserList.css";

import Trenner from '../components/trenner'
import UserBanner from  '../components/userBanner'


export default function ChatUserList({ chatMessages, matchedUsers }) {
    console.log("matchtUser")
    console.log(matchedUsers)
    const [selectedUser, setSelectedUser] = useState(null);

    var selectedUserMessages = chatMessages.filter((message) => message.receiverId === selectedUser?.userId); // filtert alle Nachrichten, die an den ausgewählten User gesendet wurden

    if (selectedUser) { // wenn ein user ausgewählt wurde, dann wird der Chat gerendert
        return (
            <>
                <Navbar></Navbar>
                <UserBanner user={selectedUser}></UserBanner>
                <button onClick={() => setSelectedUser(null)}>Back</button>	
                <Chat chatMessages={selectedUserMessages} receiver={selectedUser}></Chat>
            </>
        )
    }

    return ( // wenn kein user ausgewählt wurde, dann wird die Liste der User gerendert
        <>
            <Navbar></Navbar>
            {matchedUsers.map((user, index) => (
                <div key={index} onClick={() => setSelectedUser(user)}>
                    <UserBanner user={user}></UserBanner>
                </div>
            ))}
            <div className={"primaryContainer"}>
                <Trenner class={"small"}></Trenner>
                <p>Du möchtest dich mit mehr Menschen in Kontakt setzen? <br/><br/>
                    Dann schau dir weitere Profile an oder bearbeite dein Profil.</p>
            </div>
        </>
    )
}
