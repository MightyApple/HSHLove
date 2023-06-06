import React from "react";
import "./userBanner.css"

import ProfilePicture from "../components/profilePicture"

export default function Root(props) {
    return (
        <>
            <div className={"userBorder"}>
                <div className={"user"}>
                    <ProfilePicture profileImage={props.user.profileImage}></ProfilePicture>
                    <button>{props.user.username}</button>
                </div>
            </div>
        </>
    )};