import React from 'react';
import Navbar from '../components/navbar'
import FormButton from "../components/form/formButton";
import Tag from '../components/form/tag'
import ImgForm from '../components/form/imgForm'
import DropDown from '../components/form/dropDown'
import Trenner from '../components/trenner'

import './editProfile.css'
import FormText from "../components/form/formText";
import LoginHead from "../components/loginHead";
export default function Root(props) {
    const[data, setData]= React.useState("Log dich ein")
    const[description, setDescription]= React.useState("")

    
    React.useEffect(()=>{
        loadUserData()      
        loadImages()               
    },[])

    function createImgs(imgs){
        
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
   }

    function sendData(){
        let form=new FormData()
        form.append("description", document.getElementById("description").value)

        let inputFile = document.getElementById("imgfile");
            
        if ( inputFile.value !== '') {
            let file = inputFile.files[0];
            // Create new file so we can rename the file
            let blob = file.slice(0, file.size, "image/jpeg");
            let newFile = new File([blob], `Profilbild_post.jpeg`, { type: "image/jpeg" });
            form.append("imgfile",newFile)
        }else{
            form.append("imgfile","")
        }
        
        fetch("/updateProfile", {
            method: "POST",
            body: form,
        })
        
        
    }
   



    const tags = ['Gaming', 'Poker', 'Tiere', 'Hunde', 'Katzen', 'Essen', 'Camping', 'Wandern', 'Schlafen', 'Lesen', 'Tanzen', 'Party', 'Musik', 'Filme', 'Kochen', 'Kunst', 'Podcast', 'Singapur'] //TODO werden aus der Datenbank gezogen
    const prefs = ['männlich', 'weiblich', 'divers', 'Beziehungen', 'Freunden', 'ONS']
    const studiengaenge = ["AIS", "CVD", "BWL", "MBP"];
    const geschlecht = ["männlich", "weiblich", "divers", "BWL"];
    const maxLength = 250;
    const imgLoopCount = 1;

    


    const mainElement =
        <>
        <section className={'imgForm'}>
            {Array.from({ length: imgLoopCount }, (_, index) => (
                <ImgForm></ImgForm>
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
                        <Tag key={index} name={tag}></Tag>
                    ))}
                </div>
            </div>
            <Trenner class={'small verticle'}></Trenner>
            <div>
                <label>Ich suche nach:</label>
                <div className={'tags'}>
                    {prefs.map((pref, index) => (
                        <Tag key={index} name={pref}></Tag>
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
                    <FormButton onClick={sendData} name={'Änderungen speichern'}></FormButton>
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
                    <FormText textID={'geburtsdatum'} lable={'Wann hast du Geburtstag?'} name={'geburtstag'} placeholder={'Geburtsdatum'} password={false}></FormText>
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