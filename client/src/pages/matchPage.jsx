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
import LoadingScreen from '../components/loadingScreen';

import { socket } from '../components/socket';

function MatchPage() {
    const [id, setId] = useState([""]);
    const [images, setImages] = useState([""]);
    const [prefs, setPrefs] = useState(['ONS']);
    const [tags, setTags] = useState([{name: "test"}]);
    const [desc, setDesc] = useState("Hi ich bin Getränkelieferant.");
    const [name, setName] = useState("BBoi");
    const [age, setAge] = useState(18);
    const [studiengang, setStudiengang] = useState("Hää Sport");
    const [semester, setSemester] = useState("9. Semester"); //TODO Semseter eintragbar machen
    const [city, setCity] = useState("Bonn"); //TODO City STudiengang zuordnen

    const [currentUser, setCurrentUser] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const [currentUserTags, setcurrentUserTags] = useState("");

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

    /**
     * Gibt den Nutzer zurück, welcher aktuell vorgeschlagen wird
     * @returns {Promise<void>}
     */
    async function getUserData(currentUserId) {
        try {
            const response = await fetch('/getProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentUserId }),
            });

            if (response.ok) {
                const result = await response.json();
                setId(result.data._id);
                setDesc(result.data.description);
                setStudiengang(result.degree.name);
                setCity(result.degree.campus);
                setName(result.data.name);
                setAge(birthday(result.data.birthday));
                //setTags(result.tag);
                setPrefs(result.data.intention);
                setImages(result.data.images);
                let placeholderTag = [];
                console.log(result.tag)
                let matchedTag = false;
                for (let tag in result.tag) {
                    matchedTag = false;
                    console.log(1)
                    for (let tag2 in currentUserTags) {
                        console.log(2)
                        if (result.tag[tag]._id === currentUserTags[tag2]) {
                            matchedTag = true
                        }
                    }
                    if (matchedTag) {
                        placeholderTag.push({name: result.tag[tag].name, class: "checked"})
                    } else {
                        placeholderTag.push({name: result.tag[tag].name, class: ""})
                    }
                }
                console.log(placeholderTag)
                setTags(placeholderTag);
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    /**
     * Gibt den aktuell angemeldeten Nutzer zurück
     * @returns {Promise<any>}
     */
    async function getCurrentUser() {
        return fetch('/getUser')
            .then(response => response.json())
            .then(data => {
                setCurrentUserId(data);
                setCurrentUserId(data._id);
                setcurrentUserTags(data.tags);
                console.log(data);
            });
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    //Das ist hier ausgelagert, damit die Tags immer einlesbar sind
    useEffect(() => {
        if (currentUserTags) {
            getUserData(currentUserId);
        }
    }, [currentUserTags]);

    async function likeProfile(data) {
        aktivateTimeout(3000)
        try {
            const response = await fetch('/likeProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                var { match } = await response.json();

                if (match) {
                    console.log("Match");
                     //{ _id: id, currentUserId: currentUserId}
                    socket.emit('newMatch', {
                        matchId: data._id,
                    });
                } else {
                    console.log("No Match");
                }
                //Neues Profil laden
                await getUserData(currentUserId);
                //console.log(result.data);
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }


    async function dislikeProfile(data) {
        aktivateTimeout(3000)
        try {
            const response = await fetch('/dislikeProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            await getUserData(currentUserId)
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

    function aktivateTimeout(time) {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, time);
    }



    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simuliere einen asynchronen Ladevorgang
        setTimeout(() => {
            setIsLoading(false); // Setze isLoading auf false, wenn der Ladevorgang abgeschlossen ist
        }, 3000);
    }, []);


    return (
        <>
        {isLoading ? (
            <LoadingScreen /> // Zeige den Ladebildschirm an, solange isLoading true ist
        ) : (
            <div>
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
                    <button className={'matchButton'} id={'decline'} onClick={() => dislikeProfile({ _id: id, currentUserId: currentUserId})}></button>
                    <button className={'matchButton'} id={'accept'} onClick={() => likeProfile({ _id: id, currentUserId: currentUserId})}></button>
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
                                <Tag key={index} name={tag.name} disabled={false} class={tag.class}></Tag>
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
            </div>)}
        </>
    )
}
export default MatchPage;