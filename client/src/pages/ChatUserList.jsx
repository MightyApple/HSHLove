import React, { useMemo, useState, useEffect } from 'react'
import Chat from './Chat';
import Navbar from '../components/navbar';
import "./ChatUserList.css";
import "./startingPage.css"

import Trenner from '../components/trenner'
import UserBanner from  '../components/userBanner'
import {useMediaQuery} from "react-responsive";

import logo from "../assets/logo.svg";
import { useNavigate } from 'react-router-dom';

async function getUser() {
    return fetch('/getUser').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
        return data; //returned von der fetch Funktion den ganzen User
    });
}

export default function ChatUserList({ chatRooms, matchedUsers }) {
    const navigate = useNavigate()
    let loggedIn= getUser()
    if(!loggedIn.loggedIn){
        navigate("/")
    }
    const [selectedUser, setSelectedUser] = useState(null);
    var selectedChatRoom = chatRooms.find((chatRoom) => chatRoom.users.some((user) => user._id === selectedUser?.userId));
    var selectedUserMessages = selectedChatRoom?.messages;

    const isWideScreen = useMediaQuery({minWidth: 769});

    if (isWideScreen && selectedUser) {
        return (
            <>
                <Navbar></Navbar>
                <div className={"wideChat"}>
                    <div>
                        {matchedUsers.map((user, index) => (
                            <div key={index} onClick={() => setSelectedUser(user)}>
                                <UserBanner user={user}></UserBanner>
                            </div>
                        ))}
                        <div className={"primaryContainer"}>
                            <Trenner></Trenner>
                            <p>Du möchtest dich mit mehr Menschen in Kontakt setzen? <br/><br/>
                                Dann schau dir weitere Profile an oder bearbeite dein Profil.</p>
                        </div>
                    </div>
                    <div className={"wideChatSide"}>
                        <UserBanner user={selectedUser}></UserBanner>
                        <Chat chatMessages={selectedUserMessages} receiver={selectedUser}></Chat>
                    </div>
                </div>
            </>
        )
    } else if (isWideScreen) {
        return (
            <>
                <Navbar></Navbar>
                <div className={"wideChat"}>
                    <div>
                        {matchedUsers.map((user, index) => (
                            <div key={index} onClick={() => setSelectedUser(user)}>
                                <UserBanner user={user}></UserBanner>
                            </div>
                        ))}
                        <div className={"primaryContainer"}>
                            <Trenner></Trenner>
                            <p>Du möchtest dich mit mehr Menschen in Kontakt setzen? <br/><br/>
                                Dann schau dir weitere Profile an oder bearbeite dein Profil.</p>
                        </div>
                    </div>
                    <div className={'wideChatSide startinLogo bigHeadline'}>
                        <img src={logo} alt={'logo'} width={168} height={168}/>
                        <p>HSH<span>Love</span></p>
                    </div>
                </div>
            </>
        )
    } else if (selectedUser) { // wenn ein user ausgewählt wurde, dann wird der Chat gerendert
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
