import FormButton from "../components/form/formButton";
import logo from "../assets/logo.svg";

import './admin.css';
import { useNavigate } from "react-router-dom";

async function authorized() {
    return fetch('/authorized').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
        return data; //returned von der fetch Funktion den ganzen User
    });
}
export default function Root() {
    const navigate = useNavigate()
    let loggedIn= authorized()
    console.log("Test", loggedIn.loggedIn)
    if(loggedIn.loggedIn){
        navigate("/")
    }
    //TODO NAME DES NUTZERS
    return (
        
        <>
            <section className={'startPage secondaryContainer'}>
                <div className={'startinLogo bigHeadline'}>
                    <img src={logo} alt={'logo'} width={168} height={168}/>
                    <p>Hallo <span>Admin</span></p>
                </div>
                <div className={'startRoute'}>
                    <FormButton name={'Nutzersuchen'} route={'/nutzer'}></FormButton>
                    <FormButton name={'Gemeldete Nutzer'} route={'/gemeldet'}></FormButton>
                </div>
            </section>
        </>
    )};