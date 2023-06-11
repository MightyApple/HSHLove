import Navbar from '../components/navbar';
import React, { useState } from 'react';
import FormText from "../components/form/formText";
import DropDown from '../components/form/dropDown';

import FormButton from "../components/form/formButton";
import AdminHead from '../components/adminHead';
import { useNavigate } from 'react-router-dom';
import UserBanner from "../components/userBanner";

async function authorized() {
    return fetch('/authorized').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
        return data; //returned von der fetch Funktion den ganzen User
    });
}


export default function Root(props) {
    const navigate = useNavigate()
    let loggedIn= authorized()
    if(!loggedIn.loggedIn){
        navigate("/")
    }
    const studiengaenge = [{name: "AIS"}, {name: "CVD"}, {name: "BWL"}, {name: "MBP"}];
    const geschlecht = [{name :"männlich"}, {name: "weiblisch"}, {name: "divers"}];
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([
        { id: 1, username: 'Beispiel-Nutzer 1', blocked: false },
        { id: 2, username: 'Beispiel-Nutzer 2', blocked: false },
        { id: 3, username: 'Beispiel-Nutzer 3', blocked: false },
    ]);

    const handleClick = (item) => {
        // Funktion, die beim Klicken auf ein Element in der Liste ausgeführt wird
        console.log("Klick auf Element:", item);
        // Weitere Aktionen ausführen, z. B. Navigation zu einem bestimmten Chat-Kontakt
    };


    if (!props.first) {
        return (
            <>
                <AdminHead heading="Nutzer Suchen"></AdminHead>
                <section className={'primaryContainer'}>
                    
                    <FormText textID={'Vorname'} lable={'Name:'} name={'vorname'} placeholder={'Vorname'} password={false}></FormText>
                </section>
                <section className={'primaryContainer tagSection'}>
                    <DropDown
                        label={'Ich studiere:'}
                        selectName={'studium'}
                        selectId={'studiumId'}
                        data={studiengaenge}
                    ></DropDown>
                    
                    <DropDown
                        label={'Ich bin:'}
                        selectName={'geschlecht'}
                        selectId={'geschlechtId'}
                        data={geschlecht}
                    ></DropDown>
                </section>

                <section className={'primaryContainer'}>
                    <div className={'primaryContainer'}>
                        <div className={'primaryContainer'}>
                            <FormButton name={'Suchen'}></FormButton>
                        </div>
                    </div>
                </section>

                    <div className="reported-users-page">
                        {users.map((user, index) => {
                            //var isOnline = onlineUsers.has(user.userId);
                            return (
                                <div key={index} onClick={() => setSelectedUser(user)}>
                                    <UserBanner user={user} />
                                </div>
                            )
                        })}
                    </div>
            </>
        );
    } else {
        return (
            <>
                <Navbar></Navbar>
            </>
        );
    }
}

