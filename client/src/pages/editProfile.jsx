import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
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
    const navigate= useNavigate();
    const[succes, setSucces]= React.useState(false)

    // Read values passed on state
    if(props.first){       
        var mail= props.data.email;
        var pass= props.data.password;
    }
    
    if(succes){navigate("/login")}
    let reRender=true
    React.useEffect(()=>{
        (async()=>{
            await fetchData() 
            if(!props.first&&reRender){
                loadUserData()      
                
                reRender=false
            } 
        })();
                        
    },[reRender])


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
        navigate("/match")
        
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

//TODO gib dem die Backend entfernen Logik
    async function removeImage(event) {
        // Zugriff auf das geklickte Button-Element
        var button = event.target;

        // Zugriff auf das übergeordnete imageContainer-Element
        var imageContainer = button.parentNode;

        // Zugriff auf das übergeordnete imgInputField-Element
        var imgInputField = imageContainer.parentNode;

        var allContainer = document.getElementsByClassName('imageContainer');
        console.log(allContainer)
        for (let index = 0; index < allContainer.length; index++) {
            if(allContainer[index]===imageContainer){
                let srcString=allContainer[index].getElementsByTagName('img')[0].src
                
                console.log(srcString)
                const response =  fetch('/removeImage', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "src": srcString })
                });
    
                if (response.ok) {
                    // Entferne das imageContainer-Element aus dem imgInputField
                    imgInputField.removeChild(imageContainer);
                } else {
                    console.log('Error:', response.statusText);
                }
            }
        }

        // Erzeuge ein neues ImgForm-Element
        var newImgForm = React.createElement(ImgForm);

        // Rendere das ImgForm-Element und füge es zum imgInputField hinzu
        ReactDOM.render(newImgForm, imgInputField);
    }

    async function loadImages(data) {
        var imgField = document.getElementsByClassName("imgInputField");
        for (let index = 0; index < data.data.images.length; index++) {
            let imgString =
                "https://storage.googleapis.com/profilbilder/" +
                data.data.images[index].toString();
            console.log(imgString);

            // Erzeuge das DOM-Element für das Bild und den Button
            var imageContainer = document.createElement("div");
            imageContainer.className = "imageContainer";

            var imageElement = document.createElement("img");
            imageElement.src = imgString;
            imageElement.alt = "Vorschau";

            var removeButton = document.createElement("button");
            removeButton.className = "removeButton";
            removeButton.innerText = "X";

            // Weise den Event-Handler programmatisch zu
            removeButton.addEventListener("click", removeImage);

            // Füge das Bild und den Button zum Container hinzu
            imageContainer.appendChild(imageElement);
            imageContainer.appendChild(removeButton);

            // Füge den Container zum imgField hinzu
            imgField[index].innerHTML = ""; // Leere den Inhalt des imgField
            imgField[index].appendChild(imageContainer);
        }
    }
    
    async function loadUserData(){
        fetch('/getUserData')
        .then((res)=>res.json())
        .then((data)=>{
            setDescription(data.data.description)
            setUserTagsActive(data)
            setUserDropDowns(data) 
            loadImages(data)
        })       
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