import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import DoneIcon from '@mui/icons-material/Done';

const ColorButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    lineHeight: 1.5,
    backgroundColor: '#95C21E',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#82a819',
      borderColor: "none",
      boxShadow: 'none',
    },
  });
 
function SubmitButton({text, onClick}) {
    return (
        <ColorButton className='done' variant='contained' type='submit' onClick={onClick} endIcon={<DoneIcon />}>{text}</ColorButton>
    )
}

export default SubmitButton;