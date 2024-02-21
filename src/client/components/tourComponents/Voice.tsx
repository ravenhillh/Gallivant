import React, { useState } from 'react';
import useSpeechToText from '../../utils/speechToText';

const Voice = (): JSX.Element => {
  const [textInput, setTextInput] = useState('');
  const { isListening, transcript, startListening, stopListening } =
    useSpeechToText();

  const stopVoiceInput = () => {
    setTextInput(
      (prevState) =>
        prevState +
        (transcript.length ? (prevState.length ? ' ' : '') + transcript : '')
    );
    stopListening();
  };

  const startStopListening = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  return (
    <div>
      <button onClick={() => startStopListening()}>
        {isListening ? 'Stop Listening.' : 'Speak'}
      </button>
      <textarea
        disabled={isListening}
        value={
          isListening
            ? textInput +
              (transcript.length
                ? (textInput.length ? ' ' : '') + transcript
                : '')
            : textInput
        }
        onChange={(e) => setTextInput(e.target.value)}
      />
    </div>
  );
};

export default Voice;
