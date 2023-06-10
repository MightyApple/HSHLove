import { useNavigate } from "react-router-dom";

export default function Root(props) {
    let navigate = useNavigate();
    function logOutForm(){
        fetch("/logOut",{
            method: 'GET',
        }).then((data)=>{
            document.cookie = "loggedIn" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            navigate("/")
        })    
    }
    
    return (
        <>
            <button id="logout" onClick={logOutForm}>Abmelden</button>
        </>)}