import { Dialog } from "@mui/material";
import FileUploadButton from "./FileUploadButton";
import { Typography, Card } from "@mui/material";
import SubmitButton from "./buttons/SubmitButton";
import { useState } from "react";
import ConfirmationWindow from "./ConfirmationWindow";
import axios from "axios";

const ImportFormModal = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("csv_file", selectedFile);

      const importSchoolsLink = `${import.meta.env.VITE_API_URL}api/import/`;
      const importSchoolsHeaders = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      axios
        .post(importSchoolsLink, formData, importSchoolsHeaders)
        .then((response) => {
          setOpen(true);
          setErrorMessage(false);
          console.log("File uploaded successfully:", response.data);
        })
        .catch((error) => {
          setOpen(true);
          setErrorMessage(true);
          console.error("Error uploading file:", error);
        });
    } else {
      setOpen(true);
      setErrorMessage(true);
      console.error("No file selected");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="uploads">
        <div className="rules">
          <FileUploadButton
            name="Załącz plik .csv"
            onFileChange={handleFileChange}
            fileType=".csv"
          />
          <Typography
            variant="body1"
            style={{ fontWeight: "lighter", marginTop: "15px" }}
          >
            {selectedFile ? selectedFile.name : "Nie załączono pliku"}
          </Typography>
        </div>
      </div>

      <div className="submit">
        <SubmitButton text="Importuj" onClick={handleUpload} />
      </div>
      <ConfirmationWindow
        open={open}
        setOpen={setOpen}
        title={
          errorMessage
            ? "Wystąpił błąd przy przy importowaniu pliku, sprawdź czy plik na pewno został załączony"
            : "Poprawnie zaimportowano dane"
        }
        message={""}
        onConfirm={handleClose}
        showCancelButton={false}
      />
    </div>
  );
};

export default ImportFormModal;
