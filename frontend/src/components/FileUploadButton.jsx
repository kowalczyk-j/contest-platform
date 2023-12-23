import * as React from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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

const ColorButton = styled(Button)({
  color: 'white',
  border: 'none',
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
    border: 'none',
    boxShadow: 'none',
  },
});


function FileUploadButton({name}) {
  return (
    <>
      <ColorButton component="label" style={{width: "225px"}} variant="outlined" startIcon={<CloudUploadIcon />}>
        {name}
        <VisuallyHiddenInput type="file" />
      </ColorButton>
    </>
  );
}

export default FileUploadButton;
