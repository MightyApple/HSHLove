import React, {useEffect, useState} from 'react';
import Navbar from '../components/navbar'
import FormButton from "../components/form/formButton";
import Tag from '../components/form/tag'
import ImgForm from '../components/form/imgForm'
import DropDown from '../components/form/dropDown'
import Trenner from '../components/trenner'

import './editProfile.css'
import FormText from "../components/form/formText";
import LoginHead from "../components/loginHead";
import { useLocation, useNavigate } from 'react-router-dom';


export default function Root(props) {
    const[description, setDescription]= React.useState("")
    const[userTags,setUserTags]=React.useState();
    const navigate= useNavigate();
    const[succes, setSucces]= React.useState(false)

     // Read values passed on state
    if(props.first){       
        var mail= props.data.email;
        var pass= props.data.password;
    }
    
    if(succes){navigate("/login")}

    React.useEffect(()=>{
       
        fetchData() 
        if(!props.first){
            loadUserData()      
            loadImages()
        }                 
    },[])
    
   

    const updateForm= async ()=>{
        let formData = new FormData();
        let imgs = document.getElementsByClassName("img")
        
        let description = document.getElementById("description");
        let degree = document.getElementById("studiumId");
        let gender = document.getElementById("geschlechtId");
        let prefTags = getPrefTags();
        let likingTags= getLikingTags();
        let intentTags = getIntentionTags();
        
        formData.append("description", description.value)
        formData.append("degree", degree.value)
        formData.append("gender", gender.value)
        formData.append("intention", intentTags)
        formData.append("tags", likingTags)
        formData.append("preference", prefTags)

        for(let i=0;i<imgs.length;i++){
            if(imgs[i].files[0]!==undefined){
                formData.append("images",imgs[i].files[0] );
            }
        }  

        const result = await fetch("/updateProfile",{
            method: 'POST',
            body: formData
        })
        const resData= await result.json()
        
        setSucces(resData.noError)
    }

    const submitFirstTimeForm = async ()=>{
        let formData = new FormData();
        let imgs = document.getElementsByClassName("img")
        
        let email = mail;
        let password = pass;
        let firstname = document.getElementById("vorname");
        let birthdate = document.getElementById("geburtsdatum");
        let description = document.getElementById("description");
        let degree = document.getElementById("studiumId");
        let gender = document.getElementById("geschlechtId");
        let prefTags = getPrefTags();
        let likingTags= getLikingTags();
        let intentTags = getIntentionTags();
        
        formData.append("email", email)
        formData.append("password", password)
        formData.append("firstname", firstname.value)
        formData.append("birthdate", birthdate.value)
        formData.append("description", description.value)
        formData.append("degree", degree.value)
        formData.append("gender", gender.value)
        formData.append("intention", intentTags)
        formData.append("tags", likingTags)
        formData.append("preference", prefTags)

        for(let i=0;i<imgs.length;i++){
            if(imgs[i].files[0]!==undefined){
                formData.append("images",imgs[i].files[0] );
            }
        }  

        const result = await fetch("/signup",{
            method: 'POST',
            body: formData
        })
        const resData= await result.json()
        
        setSucces(resData.noError)
    }

    async function loadImages(){
        const files = await fetch('/getImages')
        const data= await files.json();
        /*for (let index = 0; index < data.length; index++) {
            const newImg = document.getElementById("imgContainer");
            
            newImg.setAttribute(
                "src",
                "https://storage.googleapis.com/profilbilder/"+data[index]
            )
            
        }*/
    }
    
    async function loadUserData(){
            const response = await fetch('/getUserData');
            const data= await response.json();
            setDescription(data.data.description)
            setUserTagsActive(data)
            setUserDropDowns(data)        
    }
    function setUserDropDowns(data){
        document.getElementById("studiumId").value=data.data.degree
        document.getElementById("geschlechtId").value=data.data.gender
    } 
    function setUserTagsActive(data){        
        data.data.tags.forEach(element => {
            document.getElementById(element).classList.add("checked")
        });

        let prefList= document.getElementsByClassName("pref tag")
        for(let i=0;i<prefList.length;i++){
            for (let index = 0; index < data.data.preference.length; index++) {
                if(prefList[i].innerHTML==data.data.preference[index]){
                    prefList[i].classList.add("checked")
                }
            }
        }

        let intentList= document.getElementsByClassName("intent tag")
        for(let i=0;i<intentList.length;i++){
            for (let index = 0; index < data.data.intention.length; index++) {
                if(intentList[i].innerHTML==data.data.intention[index]){
                    intentList[i].classList.add("checked")
                }
            }
        }
    }
    function getLikingTags(){
        let tags = []
        let tagID=[]
    
        tags=document.getElementsByClassName("like checked")
        for(let i=0;i<tags.length;i++){
            tagID.push(tags[i].id)
        }
        return tagID
    }
    function getIntentionTags(){
        let tags = []
        let tagInnerHtml=[]
    
        tags=document.getElementsByClassName("intent checked")
        for(let i=0;i<tags.length;i++){
            tagInnerHtml.push(tags[i].innerHTML)
        }
        return tagInnerHtml
    }

    function getPrefTags(){
        let tags = []
        let tagInnerHtml=[]
    
        tags=document.getElementsByClassName("pref checked")
        for(let i=0;i<tags.length;i++){
            tagInnerHtml.push(tags[i].innerHTML)
        }
        return tagInnerHtml
    }
    async function fetchData() {
        try {
            const response = await fetch('/getTags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setTags(result.data);
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.log('Error:', error);
        }

        try {
            const response = await fetch('/getDegree', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setStudiengaenge(result.data);
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }


    const [tags, setTags] = useState([{name: "test"}]);
    const [studiengaenge, setStudiengaenge] = useState([{name: "test", _id: "test"}]);
    const prefs = ['männlich', 'weiblich', 'divers', ];
    const intention = ['Beziehungen', 'Freunden', 'ONS'];
    const geschlecht = [
        {name: "männlich", _id: "männlich"},
        {name: "weiblich", _id: "weiblich"},
        {name: "divers", _id: "divers"}
    ];
    const maxLength = 250;
    const imgLoopCount = 6;

    


    const mainElement =
        <>
        <section className={'imgForm'}>
            {Array.from({ length: imgLoopCount }, (_, index) => (
                <ImgForm key={index} ></ImgForm>
            ))}
        </section>
        <section className={'primaryContainer'}>
            <div className={'description'}>
                <label>Beschreibung:</label>
                <textarea
                    name='description'
                    placeholder='Erzähl etwas über dich'
                    id='description'
                    maxLength={maxLength}
                    defaultValue={description}
                />
            </div>
        </section>
        <section className={'primaryContainer tagSection'}>
            <div>
                <label>Tags</label>
                <div className={'tags'}>
                    {tags.map((tag, index) => (
                        <Tag key={index} name={tag.name} id={tag._id} disabled={false} class={'like hover click'}></Tag>
                    ))}
                </div>
            </div>
            <Trenner class={'small verticle'}></Trenner>
            <div>
                <label>Ich suche nach:</label>
                <div className={'tags intention'}>
                    {intention.map((pref, index) => (
                        <Tag key={index} name={pref} id={pref._id} disabled={false} class={'intent hover click'}></Tag>
                    ))}
                </div>
                <div className={'tags pref'}>
                    {prefs.map((pref, index) => (
                        <Tag key={index} name={pref} id={pref._id} disabled={false} class={'pref hover click'}></Tag>
                    ))}
                </div>
            </div>
        </section>
        <div className={'primaryContainer'}>
            <Trenner class={'small'}></Trenner>
        </div>
        <section className={'primaryContainer tagSection'}>
            <DropDown
                label={'Ich studiere:'}
                selectName={'studium'}
                selectId={'studiumId'}
                data={studiengaenge}
            ></DropDown>
            <Trenner class={'small dnoneLG'}></Trenner>
            <DropDown
                label={'Ich bin:'}
                selectName={'geschlecht'}
                selectId={'geschlechtId'}
                data={geschlecht}
            ></DropDown>
        </section>
        <div className={'primaryContainer'}>
            <Trenner class={'small dblockLG'}></Trenner>
        </div>
        <section className={'primaryContainer'}>
            <div className={'primaryContainer'}>
                <div className={'primaryContainer'}>
                    <FormButton onClick={props.first?submitFirstTimeForm : updateForm} name={'Änderungen speichern'}></FormButton>
                </div>
            </div>
        </section>
    </>;

    if (props.first) {
        return (
            <>
                <section className={'primaryContainer'}>
                    <LoginHead></LoginHead>
                    <FormText textID={'vorname'} lable={'Was ist dein Vorname?'} name={'vorname'} placeholder={'Vorname'} password={false}></FormText>
                    <FormText textID={'geburtsdatum'} lable={'Wann hast du Geburtstag?'} name={'geburtstag'} placeholder={'Geburtsdatum'} password={false} date={true}></FormText>
                </section>
                {mainElement}
            </>
        );
    } else {
        return (
            <>
                <Navbar></Navbar>
                {mainElement}
            </>
        );
    }
};