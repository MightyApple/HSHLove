import React from "react";
import "./profilePicture.css"

export default function Root(props) {
    return (
        <>
            <img src={'https://storage.googleapis.com/profilbilder/'+props.profileImage} alt={"profil picture"} className={"profilePicture"}/>
        </>
    )};