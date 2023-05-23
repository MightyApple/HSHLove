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

    return (
        <div className={'imgInputField'}>
            <input type="file" onChange={handleImageChange} />
            {selectedImage && <img src={selectedImage} alt="Vorschau" />}
        </div>
    );
}