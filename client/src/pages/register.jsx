import LoginHead from "../components/loginHead";
import FormText from "../components/form/formText";
import FormButton from "../components/form/formButton";
import EditProfile from "./editProfile"
import {Link, Navigate, useNavigate } from "react-router-dom";
import React from "react";
import Footer from "../components/footer";

let data
function checkEmail(email){
    //console.log(email.split("@")[1])
    if(!email.split("@")[1]==="stud.hshl.de"||!email.split("@")[1]==="hshl.de"){
        return false
    }
    return true
}
export default function Root() {
    //const navigate= useNavigate();
    const[succes, setSucces]= React.useState(false);
    const[error,setError]=React.useState()
    
    
    const submitForm = async ()=>{
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let passwordwdh = document.getElementById("passwordwdh");
        data= {
            email: email.value,
            password: password.value,
            passwordwdh:passwordwdh.value
        }
        if(checkEmail(email.value)){
            const result = await fetch("/validateData",{
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
            setSucces(resData.noError)
        }else{setError("Email muss auf '@stud.hshl.de' enden")}
        
    }
    
    //if(succes){
        //navigate('/edit', { state: { email: document.getElementById("email").value, password: document.getElementById("password").value } })
    //}

    return (
        <>{!succes?
            <div className={'secondaryContainer'}>
                <LoginHead headline={'Registrieren'} text={'Erstelle ein neuen Account, um dich damit immer anmelden zu können.'}></LoginHead>
                <section>
                    
                    <FormText textID={'email'} lable={'Email'} name={'email'} placeholder={'name@example.com'} password={false}></FormText>
                    <FormText textID={'password'} lable={'Passwort'} name={'password'} placeholder={'min. 8 Zeichen'} password={true}></FormText>
                    <FormText textID={'passwordwdh'} lable={'Passwort wiederholen'} name={'password2'} placeholder={'min. 8 Zeichen'} password={true}></FormText>
                    <div>{error}</div>
                    <div className={'normalFontSize checkboxForm'}>
                        <label>eingeloggt bleiben</label>
                        <input type={"checkbox"} name={'stayLogged'} />
                    </div>
                    <FormButton onClick={submitForm} name={'Registrieren'} buttonID={'submit'}></FormButton>
                    
                    <div className={'formEnd'}>
                        <p>Du hast bereits ein Account? <Link to={'/login'} className={'normalFontSize'}>Dann melde Dich an!</Link></p>
                    </div>
                </section>
            </div>
            
        :<EditProfile first={true} data={data} ></EditProfile>}
            <Footer></Footer>
        </>
    )};