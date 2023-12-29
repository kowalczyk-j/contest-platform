import React, { useState } from 'react';
import { TextField } from '@mui/material';

function CreateCriterion( {index} ) {
    // const [description, setDescription] = useState('');
    // const [maxRating, setMaxRating] = useState('');

    return (
        <div className='criterion'>
            <div className="circle">{index}</div>
            <TextField className="description" label="Opis" variant="outlined" />
            <TextField className="max-rating" label="Punktacja" variant="outlined" type="number" InputLabelProps={{shrink: true,}} />
        </div>
    )
}

export default CreateCriterion;