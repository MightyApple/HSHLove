import Navbar from '../components/navbar';
import React, {useEffect, useState} from 'react';
import FormText from "../components/form/formText";
import DropDown from '../components/form/dropDown';

import FormButton from "../components/form/formButton";
import AdminHead from '../components/adminHead';
import { useNavigate } from 'react-router-dom';
import UserBanner from "../components/userBanner";
import AdminProfilePage from "../components/adminProfilePage";

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
        let firstname = document.getElementById("Vorname").value;
        let gender = document.getElementById("geschlechtId").value;

        const degree = document.getElementById("studiumId");
        const selectedDegreeIndex = degree.selectedIndex;
        const selectedDegreeOption = degree.options[selectedDegreeIndex];
        const degreeId = selectedDegreeOption.id;

        try {
            const response = await fetch('/findUserByAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name :firstname, degree: degreeId, gender: gender}),
            });

            if (response.ok) {
                const result = await response.json();

                setUsers(result.users)

            } else {
                console.log('Error:', response.statusText);
            }

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


    if (selectedUser) {
        console.log("selectedUser")
        return (
            <>
                <AdminProfilePage user={selectedUser}></AdminProfilePage>
            </>
        );
    } else {
        return (
            <>
                <AdminHead heading="Nutzer Suchen"></AdminHead>
                <section className={'primaryContainer'}>

                    <FormText textID={'Vorname'} lable={'Name:'} name={'vorname'} placeholder={'Vorname'}
                              password={false}></FormText>
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
                        console.log(user)
                        const currentUser = {username: user.name, profileImage: user.images[0]}
                        return (
                            <div key={index} onClick={() => setSelectedUser(user)}>
                                <UserBanner user={currentUser}/>
                            </div>
                        )
                    })}
                </div>
            </>
        );
    }
}

