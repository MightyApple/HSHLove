import React from 'react';
import Navbar from '../components/navbar'
import FormButton from "../components/form/formButton";
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

    return (
        <>
            <Navbar></Navbar>
            Name: {data}
            
        </>
    )};