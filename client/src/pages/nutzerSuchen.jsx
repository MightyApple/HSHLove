import Navbar from '../components/navbar';
import React, {useEffect, useState} from 'react';
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
    /*const navigate = useNavigate()
    let loggedIn= authorized()
    if(!loggedIn.loggedIn){
        navigate("/")
    }
     */

    const [studiengaenge, setStudiengaenge] = useState([{name: "Alle", _id: "all"}]);
    const geschlecht = [{name :"Alle"}, {name: "männlich"}, {name: "weiblich"}, {name: "divers"}];
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);


    async function findUser() {

        try {
            const response = await fetch('/findUserByAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),//TODO Name, Studiengang und Geschlecht reinwerfen
            });

        } catch (error) {
            console.log('Error:', error);
        }
    }

    async function getData() {
        try {
            const response = await fetch('/getDegree', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                const studiengaeng = [{name: "Alle", _id: "all"}, ...result.data];
                setStudiengaenge(studiengaeng);
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    useEffect(() => {
        console.log("Testschen")
        getData();
    }, []);


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
                            <FormButton name={'Suchen'} onClick={findUser}></FormButton>
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

