import React from "react";
import "./userBanner.css"

import ProfilePicture from "../components/profilePicture"

export default function userBanner(props) {
    return (
        <>
            <div className={`userBorder`}>
                <div className={`user`}>
                    <ProfilePicture profileImage={props.user.profileImage}></ProfilePicture>
                    {props.isOnline ? (
                        <div className={`${props.isOnline ? "online" : "offline"}`}></div>
                    ) : ("")}
                    <button>{props.user.username}</button>
                </div>
            </div>
        </>
    )};