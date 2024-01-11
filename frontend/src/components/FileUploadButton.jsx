import * as React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import ColorButton from './ColorButton';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function FileUploadButton({ name, onFileChange }) {
  return (
    <>
      <ColorButton component="label"
                   style={{width: "225px"}}
                   variant="contained"
                   startIcon={<CloudUploadIcon />}>
        {name}
        <VisuallyHiddenInput type="file" onChange={onFileChange} />
      </ColorButton>
    </>
  );
}

export default FileUploadButton;