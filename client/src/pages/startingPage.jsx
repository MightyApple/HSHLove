import FormButton from "../components/form/formButton";
import logo from "../assets/logo.svg";
import './startingPage.css'
import { useLocation } from "react-router-dom";
import Footer from "../components/footer";
import React from "react";

export default function Root() {
    
    return (
        <>
            <section className={'startPage secondaryContainer'}>
                <div className={'startinLogo bigHeadline'}>
                    <img src={logo} alt={'logo'} width={168} height={168}/>
                    <p>HSH<span>Love</span></p>
                </div>
                <div className={'startRoute'}>
                    <FormButton name={'Login'} route={'/login'}></FormButton>
                    <FormButton name={'Registrieren'} route={'/registrieren'}></FormButton>
                </div>
            </section>
            <Footer></Footer>
        </>
    )};