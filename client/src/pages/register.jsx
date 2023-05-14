import LoginHead from "../components/loginHead";
import FormText from "../components/form/formText";
import FormButton from "../components/form/formButton";
import {Link, Navigate } from "react-router-dom";
import React from "react";

export default function Root() {
    
    


    
    
    const submitForm = async ()=>{
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let passwordwdh = document.getElementById("passwordwdh");
        const data= {
            email: email.value,
            password: password.value,
            passwordwdh:passwordwdh.value
        }
        
        const result = await fetch("/signup",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData= await result.json()
        
    }
    
    
    
    
    
    
    return (
        <>
            <div className={'secondaryContainer'}>
                <LoginHead headline={'Registrieren'} text={'Erstelle ein neuen Account, um dich damit immer anmelden zu können.'}></LoginHead>
                <section>
                    
                    <FormText textID={'email'} lable={'Email'} name={'email'} placeholder={'name@example.com'} password={false}></FormText>
                    <FormText textID={'password'} lable={'Passwort'} name={'password'} placeholder={'min. 8 Zeichen'} password={true}></FormText>
                    <FormText textID={'passwordwdh'} lable={'Passwort wiederholen'} name={'password2'} placeholder={'min. 8 Zeichen'} password={true}></FormText>
                    <div className={'normalFontSize checkboxForm'}>
                        <label>eingelogt bleiben</label>
                        <input type={"checkbox"} name={'stayLogged'} />
                    </div>
                    <FormButton onClick={submitForm} name={'Registrieren'} buttonID={'submit'}></FormButton>
                    
                    <div className={'formEnd'}>
                        <p>Du hast bereits ein Account? <Link to={'/login'} className={'normalFontSize'}>Dann melde dich an</Link></p>
                    </div>
                </section>
            </div>
        </>
    )};