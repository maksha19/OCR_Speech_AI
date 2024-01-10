// App.tsx
import React from 'react';
import SpeechRecognition from './SpeechRecognition';

const App: React.FC = () => {
  return (
    <div className="App min-h-screen flex items-center justify-center">
      <SpeechRecognition />
    </div>
  );
};

export default App;
