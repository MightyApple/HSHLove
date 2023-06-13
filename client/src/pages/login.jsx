import './login.css'

import React from 'react'
import FormText from '../components/form/formText'
import FormButton from '../components/form/formButton'
import LoginHead from '../components/loginHead'
import {Link, Navigate, useNavigate} from "react-router-dom";
import Footer from "../components/footer";
export default function Root({ setLoggedIn }) {
    const navigate = useNavigate();
    const[succes, setSucces]= React.useState(false)
    const[error, setError]= React.useState()
    
    if(succes){
        navigate('/match')
    }
    React.useEffect(()=>{
        var input = document.getElementById("password");
        input.addEventListener("keyup", function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                document.getElementById("submitBtn").click();
            }
        });
    },[])
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
        if(resData.message){
            setError(resData.message)
        }
        if(resData.noError){
            setLoggedIn(true)
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
                    <div>{error}</div>
                    <div className={'normalFontSize checkboxForm'}>
                        <label>eingeloggt bleiben</label>
                        <input type={"checkbox"} name={'stayLogged'} />
                    </div>
                    <FormButton onClick={submitForm} name={'Login'} buttonID={'submitBtn'}></FormButton>
                    
                    
                    <div className={'formEnd'}>
                        <button className={'normalFontSize'}>Passwort vergessen</button>
                        <p>Noch kein Account? <Link to={'/registrieren'} className={'normalFontSize'}>Registriere dich</Link></p>
                    </div>

                </section>
                
            </div>
            <Footer></Footer>
        </>
    )};