import './login.css'
import logo from '../assets/logo.svg'

import React from 'react'
import FormText from '../components/form/formText'
import FormButton from '../components/form/formButton'
import LoginHead from '../components/loginHead'
import {Link, Navigate} from "react-router-dom";
import { useState } from 'react'
export default function Root() {
    const[succes, setSucces]= React.useState(false)
    
    if(succes){
        return <Navigate to="/edit"/>
    }
    

    const submitForm = async ()=>{
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        const data= {
            email: email.value,
            password: password.value
        }

        const result = await fetch("/login",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData= await result.json()
        if(resData.noError){
            setSucces(true)
        }
    }
   
    return (
        <>
            <div className={'secondaryContainer'}>
                <LoginHead headline={'Login'} text={'Melde dich mit deinen Daten deiner Registration an.'}></LoginHead>
                <section>
                    
                    
                    <FormText textID={'email'} lable={'Email'} name={'email'} placeholder={'name@example.com'} password={false}></FormText>
                    <FormText textID={'password'} lable={'Passwort'} name={'password'} placeholder={'min. 8 Zeichen'} password={true}></FormText>
                    <div className={'normalFontSize checkboxForm'}>
                        <label>eingelogt bleiben</label>
                        <input type={"checkbox"} name={'stayLogged'} />
                    </div>
                    <FormButton onClick={submitForm} name={'Login'} buttonID={'submitBtn'}></FormButton>
                    
                    
                    <div className={'formEnd'}>
                        <button className={'normalFontSize'}>Passwort vergessen</button>
                        <p>Noch kein Account? <Link to={'/registrieren'} className={'normalFontSize'}>Registrier dich</Link></p>
                    </div>

                </section>
                
            </div>
        </>
    )};