// SpeechRecognition.tsx
import React, { useState, useEffect } from 'react';

interface SpeechRecognition{
  updateScript: (voiceText:string) => void;
  isStartMic: boolean | null ;
  updateMicStatus : () => void
}

const SpeechRecognition: React.FC<SpeechRecognition> = ({updateScript,isStartMic,updateMicStatus}) => {
  const [recognition, setRecognition] = useState<any>(
    null
  );
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState<string>('');

  useEffect(() => {
    console.log('Speech',transcription)
    updateScript(transcription)
  },
  [transcription])

  useEffect(() => {
    if(isStartMic){
      startListening()
    }
  },[isStartMic])

  useEffect(() => {
    const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      updateMicStatus()
    };

    recognitionInstance.onresult = (e:any) => {
      const transcript = e.results[0][0].transcript;
      setTranscription(transcript);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.abort();
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.lang = 'ta'
      recognition.start();
    }
  };

  return (
    <div className="flex flex-col items-center m-2">
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          isListening ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={startListening}
        disabled={isListening}
      >
        {isListening ? 'Listening...' : 'Start Mic'}
      </button>
      <textarea
        className="mt-4 p-2 border border-gray-300 w-full h-14"
        placeholder="Transcription will appear here"
        value={transcription}
        readOnly
      />
    </div>
  );
};

export default SpeechRecognition;
