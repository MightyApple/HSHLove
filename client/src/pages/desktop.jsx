import React from "react";
import AdminHead from "../components/adminHead";
import chatIcon from "../assets/chat-svgrepo-com.svg";
import "./desktop.css"
import { useNavigate } from "react-router-dom";

async function authorized() {
    return fetch('/authorized').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
        return data; //returned von der fetch Funktion den ganzen User
    });
  }
function Blockieren() {
    const navigate = useNavigate()
    let loggedIn= authorized()
    if(!loggedIn.loggedIn){
        navigate("/")
    }
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