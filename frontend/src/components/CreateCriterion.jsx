import React, { useState, useEffect } from 'react';
import { TextField, IconButton } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function CreateCriterion( {index, onCriterionChange, onCriterionRemove} ) {
    const [description, setDescription] = useState('');
    const [maxRating, setMaxRating] = useState('');

    useEffect(() => {
        onCriterionChange(index, { description, max_rating: maxRating });
    }, [description, maxRating]);

    return (
        <div className='criterion'>
            {index > 1 ? (
                <IconButton onClick={onCriterionRemove} aria-label="delete" style={{height: "40px", width: "40px", marginTop: "8px"}}>
                    <RemoveCircleOutlineIcon style={{color: "#E95830"}} />
                </IconButton>
            ) : (<div style={{height: "40px", width: "40px"}}></div>)}
            
            <div className="circle">{index}</div>
            <TextField required className="description" label="Opis" variant="outlined" 
                value={description} onChange={(e) => setDescription(e.target.value)}/>
            <TextField required className="max-rating" label="Punktacja" variant="outlined" type="number" InputLabelProps={{shrink: true,}}
                 value={maxRating} onChange={(e) => setMaxRating(e.target.value)}/>
        </div>
    )
}

export default CreateCriterion;