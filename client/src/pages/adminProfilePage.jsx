import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMediaQuery } from 'react-responsive';

import scrollUp from '../assets/double-up-svgrepo-com.svg';
import './matchPage.css';

import AdminHead from '../components/adminHead';
import Trenner from '../components/trenner';
import Tag from "../components/form/tag";
import LoadingScreen from '../components/loadingScreen';
import Footer from '../components/footer'
import {useNavigate} from "react-router-dom";


function adminProfilePage(user) {

    const navigate = useNavigate()
    const [id, setId] = useState([""]);
    const [images, setImages] = useState([""]);
    const [prefs, setPrefs] = useState(['ONS']);
    const [tags, setTags] = useState([{name: "test"}]);
    const [desc, setDesc] = useState("Hi ich bin Getränkelieferant.");
    const [name, setName] = useState("BBoi");
    const [age, setAge] = useState(18);
    const [studiengang, setStudiengang] = useState("Hää Sport");
    const [city, setCity] = useState("Bonn");

    const [currentUser, setCurrentUser] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const [currentUserTags, setcurrentUserTags] = useState("");


    const [profil, setProfil] = useState(true);
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
    return (
        <>
            <div>
                <AdminHead></AdminHead>
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
export default adminProfilePage;