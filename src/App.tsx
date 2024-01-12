// App.js
import React, { useState, useRef } from 'react';
import SpeechRecognition from './SpeechRecognition';
import Tesseract from 'tesseract.js'


import './App.css';

const App = () => {
  const [image, setImage] = useState<null | string>(null);
  const [previewText, setPreviewText] = useState('');
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<any>(null);
  const [textSelection, setTextSelection] = useState<{start:string,end:string} | null>(null);
  const [isStartMic, setIsStartMic] = useState<boolean | null>(null);

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

  const updateScript = (voiceText:string) => {
    console.log('updateScript',voiceText);
    if(textSelection){
      const {start, end} = textSelection
      const startPointer = Number(start)
      const endPointer = Number(end)
      const updateText =  previewText.slice(0, Math.abs(startPointer)) + voiceText + previewText.slice(Math.abs(endPointer))
      setPreviewText(updateText)
      setTextSelection(null)
    }
  }

  const selectTextSelection= (event:any) =>{
    setTextSelection({
      start:event.target.selectionStart,
      end:event.target.selectionEnd
    })
    const selection = event.target.value.substring(
      event.target.selectionStart,
      event.target.selectionEnd,
    );
    console.log(selection)
    setIsStartMic(true)
  }
  const updateMicStatus  = () =>{
    setIsStartMic(null)
  }
  const getCursorPosition = () => {
    if (textareaRef.current) {
      setTextSelection({
        start:textareaRef.current.selectionStart,
        end:textareaRef.current.selectionEnd
      })
    }
    return -1; // Return -1 if textareaRef is not available
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

      <div className="flex flex-wrap md:flex-nowrap justify-center items-start min-h-[300px] md:min-h-[600px]">
        <div className="w-full md:w-1/2 mb-4 md:mb-0 border-2 border-red-300 min-h-[300px] md:min-h-[600px] ">
          {image && (
            <div>
              <img src={image} alt="Preview" className="max-w-full max-h-[550px] object-contain" />
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 h-full m-2">
        <SpeechRecognition updateScript={updateScript} isStartMic={isStartMic} updateMicStatus={updateMicStatus} />
          <div>
            <h2 className="text-xl font-semibold mb-2">Detected Text:</h2>
            <div className='className="w-full p-2 border border-red-300"'>
              <textarea
                ref={textareaRef}
                value={previewText}
                rows={16}
                className="w-full p-2 border border-gray-300"
                onChange={(e) => setPreviewText(e.target.value)}
                onSelect={(e) => e.target.addEventListener("select",selectTextSelection)}
                onKeyDown={e=> getCursorPosition()}
                onClick={e=> getCursorPosition()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;