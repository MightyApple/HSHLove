import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMediaQuery } from 'react-responsive';

import scrollUp from '../assets/double-up-svgrepo-com.svg';
import '../pages/matchPage.css';

import AdminHead from './adminHead';
import Trenner from './trenner';
import Tag from "./form/tag";
import LoadingScreen from './loadingScreen';
import Footer from './footer'


function AdminProfilePage(user) {

    console.log("user")
    console.log(user.user)

    const [id, setId] = useState(user.user._id);
    const [images, setImages] = useState(user.user.images);
    const [prefs, setPrefs] = useState(user.user.intention);
    const [tags, setTags] = useState(user.user.tags);
    const [desc, setDesc] = useState(user.user.description);
    const [name, setName] = useState(user.user.name);
    const [age, setAge] = useState(birthday(user.user.birthday));
    const [studiengang, setStudiengang] = useState(user.user.degree);
    const [city, setCity] = useState("");

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
    async function getUserData() {
        try {
            const response = await fetch('/getReportedProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user }),
            });

            if (response.ok) {
                const result = await response.json();

                setStudiengang(result.degree.name)
                setCity(result.degree.campus)
                setTags(result.tag)

            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    //Das ist hier ausgelagert, damit die Tags immer einlesbar sind
    useEffect(() => {
        getUserData();

    }, []);

    return (
        <>
            <div>
                <AdminHead id={id}></AdminHead>
                <section className={'primaryContainer slider'}>
                    <Slider {...settings}>
                        {Array.from({length: images.length}, (_, index) => (
                            <div key={index} className={'content'}>
                                <img src={'https://storage.googleapis.com/profilbilder/' + images[index]}
                                     alt={"Bild " + index}/>
                                <ul className={'normalFontSize visible' + index}>
                                    <li className={'name'}>{name} <span className={'age'}>{age}</span></li>
                                    <li>{studiengang}</li>
                                    <li>{city}</li>
                                </ul>
                            </div>
                        ))}
                    </Slider>
                </section>
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
                <Footer></Footer>
            </div>
        </>
    )
}
export default AdminProfilePage;