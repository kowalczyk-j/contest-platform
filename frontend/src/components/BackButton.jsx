import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextButton from './TextButton';


function BackButton({clickHandler}) {
    return (
        <TextButton className="back" onClick={clickHandler} startIcon={<ArrowBackIcon />}>powrót</TextButton>
    )
}

export default BackButton;