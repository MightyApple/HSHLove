import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import "./userBanner.css"
import options from "../assets/three-dots-svgrepo-com.svg"

import ProfilePicture from "../components/profilePicture"

export default function UserBanner(props) {

    const navigate= useNavigate();

    function blockUser(user, status) {
        console.log("BLOCK")
        return fetch('/blockProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, status }),
        })
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }

    function HandleBlockUserClick() {
        blockUser(props.user, false)
            .then(data => {
                navigate("/match")
            })
            .catch(error => {
                // Handle any errors that occur during the request
            });
    }

    function HandleReportClick() {
        blockUser(props.user, true)
            .then(data => {
                navigate("/match")
                //Seite wird neu geladen, damit die Chats aktualisiert sind
                window.location.reload(false);
            })
            .catch(error => {
                // Handle any errors that occur during the request
            });
    }

    return (
        <>
            <div className={`userBorder`}>
                <div className={`user`}>
                    <ProfilePicture profileImage={props.user.profileImage}></ProfilePicture>
                    {props.showOnline ? (
                        <div className={`${props.isOnline ? "online" : "offline"}`}></div>
                    ) : ("")}
                    <button>{props.user.username}</button>
                    {props.options && (
                        <div className={"dropdown"}>
                            <button className={"options"}>
                                <img src={options}  alt={"options"}/>
                            </button>
                            <div className="dropdown-content">
                                <button onClick={HandleBlockUserClick}>Nutzer Blockieren</button>
                                <button onClick={HandleReportClick}>Nutzer Melden</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )};