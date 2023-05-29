import React from 'react';
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
    const isWideScreen = useMediaQuery({minWidth: 1000});
    const isMediumScreen = useMediaQuery({ minWidth: 426, maxWidth: 999 });

    let settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        arrows: false
    };

    if (isWideScreen) {
        settings.slidesToShow = 3;
    } else if (isMediumScreen) {
        settings.slidesToShow = 2;
    } else {
        settings.slidesToShow = 1;
    }

    const images = 4; //TODO Hier werden alle Bilder nachher reingeladen
    const prefs = ['Beziehungen']
    const tags = ['Gaming', 'Poker', 'Tiere', 'Hunde', 'Katzen', 'Essen', 'Camping'];
    const desc = "Hi ich bin Getränkelieferant.";
    const name = "BBoi";
    const age = 18;
    const studiengang = "Hää Sport";
    const semester = "9tes Semester";
    const city = "Bonn";

    return (
        <>
            <Navbar></Navbar>
            <section className={'primaryContainer slider'}>
                <Slider {...settings}>
                    {Array.from({length: images}, (_, index) => (
                        <div className={'content'}>
                            <img src={selectedImage} alt="Bild 1"/>
                            <ul className={'normalFontSize'}>
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
                <button className={'matchButton'} id={'accept'}></button>
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
                            <Tag key={index} name={tag} disabled={false} class={'hover'}></Tag>
                        ))}
                    </div>
                </div>
                <Trenner class={'small verticle'}></Trenner>
                <div className={'tagBox'}>
                    <div className={'tags'}>
                        {prefs.map((pref, index) => (
                            <Tag key={index} name={pref} disabled={false} class={'hover'}></Tag>
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