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
import Footer from "../components/footer";

/* holt das user object*/
async function authorized() {
    return fetch('/authorized').then(response => response.json()).then(data => {
        return data;
    });
}

/* zeigt die user mit match im Chat an*/
export default function ChatUserList({ chatRooms, matchedUsers, onlineUsers }) {
    const navigate = useNavigate()
    let loggedIn = authorized()
    // if(!loggedIn.loggedIn){
    //     navigate("/")
    // }

    const [selectedUser, setSelectedUser] = useState(null);
    /* findet den ausgewählten Chatroom*/
    var selectedChatRoom = chatRooms.find((chatRoom) => chatRoom.users.some((user) => user._id === selectedUser?.userId));
    var selectedUserMessages = selectedChatRoom?.messages;

    /* prüft die Bildschirmbreite*/
    const isWideScreen = useMediaQuery({minWidth: 769});

    function MatchedUserList({}) {
        return (
            <>
                {matchedUsers.map((user, index) => {
                    var isOnline = onlineUsers.has(user.userId);
                    return (
                        <div key={index} onClick={() => setSelectedUser(user)}>
                            <UserBanner user={user} isOnline={isOnline} />
                        </div>
                    )
                })}
            </>
        )
    }
    /* wenn der Screen breiter als 768px ist und ein user ausgewählt wird*/
    if (isWideScreen && selectedUser) {
        return (
            <>
                <Navbar></Navbar>
                <div className={"wideChat"}>
                    <div>
                        <MatchedUserList />
                        <div className={"primaryContainer"}>
                            <Trenner></Trenner>
                            <p>Du möchtest Dich mit mehr Menschen in Kontakt setzen? <br/><br/>
                                Dann schau Dir weitere Profile an oder bearbeite dein Profil.</p>
                        </div>
                    </div>
                    <div className={"wideChatSide"}>
                        <UserBanner user={selectedUser} options={true}></UserBanner>
                        <Chat chatMessages={selectedUserMessages} receiver={selectedUser}></Chat>
                    </div>
                </div>
                <Footer abmelden={true}></Footer>
            </>
        )
        /* wenn der Screen breiter als 768px ist und kein user ausgewählt wird*/
    } else if (isWideScreen) {
        return (
            <>
                <Navbar></Navbar>
                <div className={"wideChat"}>
                    <div>
                        <MatchedUserList />
                        <div className={"primaryContainer"}>
                            <Trenner></Trenner>
                            <p>Du möchtest Dich mit mehr Menschen in Kontakt setzen? <br/><br/>
                                Dann schau Dir weitere Profile an oder bearbeite dein Profil.</p>
                        </div>
                    </div>
                    <div className={'wideChatSide startinLogo bigHeadline'}>
                        <img src={logo} alt={'logo'} width={168} height={168}/>
                        <p>HSH<span>Love</span></p>
                    </div>
                </div>
                <Footer abmelden={true}></Footer>
            </>
        )
        /* wenn ein user ausgewählt wird*/
    } else if (selectedUser) { 
        return (
            <>
                <Navbar></Navbar>
                <UserBanner user={selectedUser} options={true}></UserBanner>
                <button onClick={() => setSelectedUser(null)}>Back</button>	
                <Chat chatMessages={selectedUserMessages} receiver={selectedUser}></Chat>
                <Footer abmelden={true}></Footer>
            </>
        )
    }
/* wenn kein user ausgewählt wird*/
    return ( 
        <>
            <Navbar></Navbar>
            <MatchedUserList />
            <div className={"primaryContainer"}>
                <Trenner class={"small"}></Trenner>
                <p>Du möchtest Dich mit mehr Menschen in Kontakt setzen? <br/><br/>
                    Dann schau Dir weitere Profile an oder bearbeite Dein Profil.</p>
            </div>
            <Footer abmelden={true}></Footer>
        </>
    )
}
