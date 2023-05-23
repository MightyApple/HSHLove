import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import selectedImage from "../assets/logo.svg";

import Navbar from '../components/navbar'

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Anzahl der Seiten pro Zeile (Standard: 1)
    slidesToScroll: 1
};

const images = 3; //TODO Hier werden alle Bilder nachher reingeladen

export default function Root() {
    return (
        <>
            <Navbar></Navbar>
            <div className={'primaryContainer'}>
                <Slider {...settings}>
                    {Array.from({ length: images }, (_, index) => (
                        <div>
                            <img src={selectedImage} alt="Bild 1"/>
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    )};