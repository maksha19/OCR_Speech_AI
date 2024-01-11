// App.js
import React, { useState } from 'react';
import SpeechRecognition from './SpeechRecognition';
import Tesseract from 'tesseract.js'

import './App.css';

const App = () => {
  const [image, setImage] = useState<null | string>(null);
  const [previewText, setPreviewText] = useState('');
  const [progress, setProgress] = useState(0);

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
    setProgress(0)
    Tesseract.recognize(
      file,
      'tam', // Specify language (e.g., English)
      {
        logger: (info) => {
          if (info.status.toString() === 'recognizing text') {
            setProgress(info.progress)
          }
          console.log(info)
        }
      }
    ).then(({ data }) => {
      console.log(data);
      setPreviewText(data.text);
    });
  }

  // Reset image and text when changing the image
  const handleImageChange = () => {
    setImage(null);
    setPreviewText('');
  };


  return (
    <div className="container mx-auto my-8 text-center">
      <h1 className="text-3xl font-semibold mb-4">Image Text Detection</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {(
        <div className="mb-4">
          <progress value={progress} max="1" className="w-full"
            style={{ background: `linear-gradient(90deg, blue ${progress * 100}%, red ${progress * 100}%)` }}
          ></progress>
        </div>
      )}

      <div className="flex flex-wrap justify-center items-start h-96">
        <div className="w-full md:w-1/2 mb-4 md:mb-0 h-full border-2 border-red-300">
          {image && (
            <div>
              <img src={image} alt="Preview" className="max-w-full h-48 md:h-auto object-contain" />
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 h-full ">
        <SpeechRecognition />
          <div>
            <h2 className="text-xl font-semibold mb-2">Detected Text:</h2>
            <div className='className="w-full p-2 border border-red-300"'>
              <textarea
                value={previewText}
                rows={10}
                className="w-full p-2 border border-gray-300"
                onChange={(e) => setPreviewText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;