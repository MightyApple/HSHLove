import React from 'react';
import Navbar from '../components/navbar'
import FormButton from "../components/form/formButton";
import Tag from '../components/form/tag'
import ImgForm from '../components/form/imgForm'
import DropDown from '../components/form/dropDown'
import Trenner from '../components/trenner'

import './editProfile.css'
export default function Root() {
    const[data, setData]= React.useState("Log dich ein")
    
    React.useEffect(()=>{
        const email = loadEmail()
        console.log(email)
        
        
    },[])
    
   async function loadEmail(){
        const response = await fetch('/getEmail');
        const data = await response.json();
        setData(data.email)

        console.log(data)
   }

    const tags = ['Gaming', 'Poker', 'Tiere', 'Hunde', 'Katzen', 'Essen', 'Camping', 'Wandern', 'Schlafen', 'Lesen', 'Tanzen', 'Party', 'Musik', 'Filme', 'Kochen', 'Kunst', 'Podcast', 'Singapur'] //TODO werden aus der Datenbank gezogen
    const prefs = ['männlich', 'weiblich', 'divers', 'Beziehungen', 'Freunden', 'ONS']
    const studiengaenge = ["AIS", "CVD", "BWL", "MBP"];
    const geschlecht = ["männlich", "weiblich", "divers", "BWL"];
    const maxLength = 250;
    const imgLoopCount = 6;

    return (
        <>
            <Navbar></Navbar>
            <section className={'imgForm'}>
                {Array.from({ length: imgLoopCount }, (_, index) => (
                    <ImgForm></ImgForm>
                ))}
            </section>
            <section className={'primaryContainer'}>
                <div className={'description'}>
                    <label>Beschreibung:</label>
                    <textarea
                        name="description"
                        placeholder='Erzähl etwas über dich'
                        maxLength={maxLength}
                    />
                </div>
            </section>
            <section className={'primaryContainer'}>
                <label>Tags</label>
                <div className={'tags'}>
                    {tags.map((tag, index) => (
                        <Tag key={index} name={tag}></Tag>
                    ))}
                </div>
            </section>
            <Trenner class={"small"}></Trenner>
            <section className={'primaryContainer'}>
                <label>Ich suche nach:</label>
                <div className={'tags'}>
                    {prefs.map((pref, index) => (
                        <Tag key={index} name={pref}></Tag>
                    ))}
                </div>
            </section>
            <Trenner class={"small"}></Trenner>
            <section className={'primaryContainer'}>
                <DropDown
                    label={"Ich studiere:"}
                    selectName={"studium"}
                    selectId={"studiumId"}
                    data={studiengaenge}
                ></DropDown>
                <Trenner class={"small"}></Trenner>
                <DropDown
                    label={"Ich bin:"}
                    selectName={"geschlecht"}
                    selectId={"geschlechtId"}
                    data={geschlecht}
                ></DropDown>
            </section>
            <section className={"primaryContainer"}>
                <FormButton name={"Änderungen speichern"}></FormButton>
            </section>
        </>
    )};