import React from 'react';
import useSpeechToText from '../../utils/speechToText';

import {
  TextField,
  Fab,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
  MicIcon,
  MicOffIcon,
} from '../../utils/material';
import { FormHelperText } from '@mui/material';

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
      <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined'>
        <InputLabel htmlFor='outlined-adornment-label'>{label}</InputLabel>
        <OutlinedInput
          id={`outlined-adornment-${label}`}
          type='text'
          fullWidth
          disabled={isListening}
          autoFocus={type === 'name'}
          multiline={type === 'description'}
          // helperText={helperText}
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
          label={label}
        />
        <FormHelperText>
          {helperText}
        </FormHelperText>
      </FormControl>
  );
};

export default Voice;
