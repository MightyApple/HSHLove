import React, { useMemo, useState, useEffect } from 'react'
import Chat from './Chat';
import Navbar from '../components/navbar';
import "./ChatUserList.css";

import Trenner from '../components/trenner'
import UserBanner from  '../components/userBanner'

export default function ChatUserList({ chatRooms, matchedUsers }) {
    const [selectedUser, setSelectedUser] = useState(null);
    var selectedChatRoom = chatRooms.find((chatRoom) => chatRoom.users.some((user) => user._id === selectedUser?.userId));
    var selectedUserMessages = selectedChatRoom?.messages;




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
