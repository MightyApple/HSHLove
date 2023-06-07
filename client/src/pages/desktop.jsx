import React from "react";
import AdminHead from "../components/adminHead";
import chatIcon from "../assets/chat-svgrepo-com.svg";
import "./desktop.css"

function Blockieren() {
    const handleButtonClick = () => {
        // Handle button click logic here
    };

    return (
        <div>
            <AdminHead
                onClick={handleButtonClick}
                buttonID="myButton"
                showChat={true}
                chatIcon={chatIcon}
                chatText="Chat"
            />
        </div>
    );
}

export default Blockieren;