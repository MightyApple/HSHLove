import React from "react";
import './loadingScreen.css'

export default function Root() {
    return (
        <>
            <div className="spinner">
                <span>Loading...</span>
                <div className="half-spinner"></div>
            </div>
        </>
    );
}