import React, { useState } from 'react';
import './imgForm.css'

export default function ImgForm() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                setSelectedImage(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    function handleRemoveImage() {
        setSelectedImage(null);
    }

    return (
        <div className={'imgInputField'}>
            <input type="file" onChange={handleImageChange} class="img" accept="image/png, image/gif, image/jpeg" />
            {selectedImage &&
            <div className="imageContainer">
                <img src={selectedImage} alt="Vorschau" />
                <button className="removeButton" onClick={handleRemoveImage}>
                    X
                </button>
            </div>}
        </div>
    );
}
