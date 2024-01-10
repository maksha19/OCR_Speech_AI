// SpeechRecognition.tsx
import React, { useState, useEffect } from 'react';


const SpeechRecognition: React.FC = () => {
  const [recognition, setRecognition] = useState<any>(
    null
  );
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState<string>('');

  useEffect(() => {
    const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
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
    <div className="flex flex-col items-center mt-10">
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
        className="mt-4 p-2 border border-gray-300 w-64 h-32"
        placeholder="Transcription will appear here"
        value={transcription}
        readOnly
      />
    </div>
  );
};

export default SpeechRecognition;
