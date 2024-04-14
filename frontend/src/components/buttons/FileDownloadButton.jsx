import ColorButton from './ColorButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function FileDownloadButton({ text, link }) {
  return (
    <ColorButton
      className="download"
      style={{ width: "225px" }}
      variant="contained"
      type="submit"
      href={link}
      endIcon={<CloudDownloadIcon />}
    >
      {text}
    </ColorButton>
  );
}

export default FileDownloadButton;