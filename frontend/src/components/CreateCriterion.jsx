import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

function CreateCriterion( {index, onCriterionChange} ) {
    const [description, setDescription] = useState('');
    const [maxRating, setMaxRating] = useState('');

    useEffect(() => {
        onCriterionChange(index, { description, max_rating: maxRating });
    }, [description, maxRating]);

    return (
        <div className='criterion'>
            <div className="circle">{index}</div>
            <TextField className="description" label="Opis" variant="outlined" 
                value={description} onChange={(e) => setDescription(e.target.value)}/>
            <TextField className="max-rating" label="Punktacja" variant="outlined" type="number" InputLabelProps={{shrink: true,}}
                 value={maxRating} onChange={(e) => setMaxRating(e.target.value)}/>
        </div>
    )
}

export default CreateCriterion;