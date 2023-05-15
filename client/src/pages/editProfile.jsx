import React from 'react';
import Navbar from '../components/navbar'
import FormButton from "../components/form/formButton";
import Tag from '../components/tag'

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

        
   }


   const tags = ['Gaming', 'Poker', 'Tiere', 'Hunde', 'Katzen', 'Essen', 'Camping', 'Wandern', 'Schlafen'] //TODO werden aus der Datenbank gezogen

    return (
        <>
            <Navbar></Navbar>
            Name: {data}
            <section className={'primaryContainer'}>
                <label>Tags</label>
                <div className={'tags'}>
                    {tags.map((tag, index) => (
                        <Tag key={index} name={tag}></Tag>
                    ))}
                </div>
            </section>
        </>
    )};