import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const TextButton = styled(Button)({
    color: 'black',
    border: 'none',
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 20,
    fontWeight: 'lighter',
    padding: '6px 12px',
    lineHeight: 1.5,
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
      color: '#82a819',
      borderColor: "none",
      border: 'none',
      boxShadow: 'none',
    },
  });
  
export default TextButton;