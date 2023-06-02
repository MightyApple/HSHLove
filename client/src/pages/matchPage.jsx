import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMediaQuery } from 'react-responsive';

import selectedImage from "../assets/logo.svg";
import scrollUp from '../assets/double-up-svgrepo-com.svg';
import './matchPage.css';

import Navbar from '../components/navbar';
import Trenner from '../components/trenner';
import Tag from "../components/form/tag";

function MatchPage() {
    const [id, setId] = useState([""]);
    const [images, setImages] = useState([""]);
    const [prefs, setPrefs] = useState(['ONS']);
    const [tags, setTags] = useState(['Gaming', 'Poker', 'Tiere', 'Hunde', 'Katzen', 'Essen', 'Camping']);
    const [desc, setDesc] = useState("Hi ich bin Getränkelieferant.");
    const [name, setName] = useState("BBoi");
    const [age, setAge] = useState(18);
    const [studiengang, setStudiengang] = useState("Hää Sport");
    const [semester, setSemester] = useState("9. Semester"); //TODO Semseter eintragbar machen
    const [city, setCity] = useState("Bonn"); //TODO City STudiengang zuordnen

    const [myId, setMyId] = useState("");

    /**
     * Rechnet aus, wie alt der Nutzer ist
     * @param date
     * @returns {number}
     */
    function birthday(date) {
        const birthday = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();

        // Überprüfen, ob der Geburtstag bereits stattgefunden hat
        if (
            today.getMonth() < birthday.getMonth() ||
            (today.getMonth() === birthday.getMonth() &&
                today.getDate() < birthday.getDate())
        ) {
            // Reduziere das Alter um 1, wenn der Geburtstag noch nicht stattgefunden hat
            age--;
        }
        return age;
    }

    async function fetchData() {
        try {
            const response = await fetch('/getProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setId(result.data._id);
                setDesc(result.data.description);
                setStudiengang(result.data.degree);
                setName(result.data.name);
                setAge(birthday(result.data.birthday));
                setTags(result.data.tags);
                setPrefs(result.data.intention);
                setImages(result.data.images)
                console.log(result.data._id);
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async function getUser() {
        return fetch('/getUser').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
                setMyId(data._id);
                return data; //returned von der fetch Funktion den ganzen User
            }
        );
    }

    useEffect(() => {
        getUser();
        fetchData();
    }, []);

    async function likeProfile(data) {
        try {
            const response = await fetch('/likeProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                //Neues Profil laden
                fetchData();
                //console.log(result.data);
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }



    const isWideScreen = useMediaQuery({minWidth: 1000});
    const isMediumScreen = useMediaQuery({ minWidth: 426, maxWidth: 999 });

    let settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        arrows: false
    };

    if (isWideScreen && images.length >= 3) {
        settings.slidesToShow = 3;
    } else if (isMediumScreen && images.length >= 2) {
        settings.slidesToShow = 2;
    } else {
        settings.slidesToShow = 1;
    }


    console.log("myID "+ myId)

    return (
        <>
            <Navbar></Navbar>
            <section className={'primaryContainer slider'}>
                <Slider {...settings}>
                    {Array.from({length: images.length}, (_, index) => (
                        <div key={index} className={'content'}>
                            <img src={'https://storage.googleapis.com/profilbilder/'+images[index]} alt={"Bild "+index}/>
                            <ul className={'normalFontSize visible'+index}>
                                <li className={'name'}>{name} <span className={'age'}>{age}</span></li>
                                <li>{studiengang}</li>
                                <li>{semester}</li>
                                <li>{city}</li>
                            </ul>
                        </div>
                    ))}
                </Slider>
            </section>
            <div>
                <button className={'matchButton'} id={'decline'}></button>
                <button className={'matchButton'} id={'accept'} onClick={() => likeProfile({ _id: id, myId: myId})}></button>
            </div>
            <a className={'scrollUp'} href={'#'}>
                <img src={scrollUp} alt={'scrollUp'}/>
            </a>
            <div>
                <Trenner></Trenner>
            </div>
            <section className={'tagSection'}>
                <div className={'tagBox'}>
                    <div className={'tags'}>
                        {tags.map((tag, index) => (
                            <Tag key={index} name={tag} disabled={false} class={'b'}></Tag>
                        ))}
                    </div>
                </div>
                <Trenner class={'small verticle'}></Trenner>
                <div className={'tagBox'}>
                    <div className={'tags'}>
                        {prefs.map((pref, index) => (
                            <Tag key={index} name={pref} disabled={false} class={'b'}></Tag>
                        ))}
                    </div>
                </div>
            </section>
            <div>
                <Trenner></Trenner>
            </div>
            <section className={'primaryContainer'}>
                <p className={'desc'}>
                    {desc}
                </p>
            </section>
        </>
    )
}
export default MatchPage;