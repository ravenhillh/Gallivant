import React from 'react';
import useSpeechToText from '../../utils/speechToText';

import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
  MicIcon,
  MicOffIcon,
} from '../../utils/material';

const Voice = ({
  textInput,
  setTextInput,
  type,
  label,
  helperText,
}): JSX.Element => {
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
    <FormControl fullWidth  variant='outlined'>
      <InputLabel htmlFor='outlined-adornment-label'>{label}</InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${label}`}
        type='text'
        disabled={isListening}
        autoFocus={type === 'name'}
        multiline={type === 'description'}
        label={label}
        onChange={(e) => setTextInput(e.target.value)}
        value={
          isListening
            ? textInput +
              (transcript.length
                ? (textInput.length ? ' ' : '') + transcript
                : '')
            : textInput
        }
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle speech to text'
              color={isListening ? 'warning' : 'success'}
              onClick={startStopListening}
              onMouseDown={startStopListening}
              edge='end'
            >
              {isListening ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default Voice;
