import * as React from 'react';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
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

function FileDownloadButton({ name, onFileChange }) {
  return (
    <>
      <ColorButton component="label"
        style={{ width: "225px" }}
        variant="contained"
        startIcon={<CloudDownloadIcon />}>
        {name}
        <VisuallyHiddenInput type="file" onChange={onFileChange} />
      </ColorButton>
    </>
  );
}

export default FileDownloadButton;