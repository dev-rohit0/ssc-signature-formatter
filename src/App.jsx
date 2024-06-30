import React, { useState, useRef } from 'react';

function App() {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'formatted_signature.jpg';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url); // Clean up the URL object
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setFile(event.dataTransfer.files[0]);
        }
    };

    const handleDropzoneClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="App">
            <h1>Upload Your Signature</h1>
            <div
                className={`dropzone ${dragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleDropzoneClick}
                style={{
                    border: '2px dashed #ccc',
                    borderRadius: '5px',
                    padding: '20px',
                    textAlign: 'center',
                    marginBottom: '10px',
                    cursor: 'pointer',
                }}
            >
                {file ? (
                    <p>{file.name}</p>
                ) : (
                    <p>Drag & drop a file here, or click to select a file</p>
                )}
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
            </div>
            <div className='btnSubmit'>
                <button onClick={handleUpload}>Upload and Format</button>
            </div>
        </div>
    );
}

export default App;
