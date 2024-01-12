import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ColorButton from './ColorButton';


function SubmitButton({text, onClick}) {
    return (
        <ColorButton className='done' style={{width: "225px"}} variant='contained' type='submit' onClick={onClick} startIcon={<DoneIcon />}>
          {text}
        </ColorButton>
    )
}

export default SubmitButton;