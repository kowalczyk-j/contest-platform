import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import FileUploadButton from "./FileUploadButton"; /* TODO: stwórz FileDownload zamiast FileUpload */
import GradeEntryForm from "./GradeEntryForm";
import BackButton from "./BackButton";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ConfirmationWindow from "./ConfirmationWindow";
import Navbar from "./Navbar";

const GreenButton = styled(Button)({
  backgroundColor: "#95C21E",
  color: "white",
  "&:hover": {
    backgroundColor: "#82a819",
  },
});

const GradeEntry = () => {
  const [gradesAndCriterions, setGradesAndCriterions] = useState([]);
  const [entry, setEntry] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState("");
  const [uploadError, setUploadError] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const navigate = useNavigate();
  const { entryId } = useParams();

  const handleGradeFetch = async (event) => {
    setFetchError(false);

    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      };

      const entryResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}api/entries/${entryId}`,
        headers,
      );
      const entry = entryResponse.data;
      console.log(entry);
      setEntry(entry);

      const gradeResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}api/grades/?entry=${entryId}`,
        headers,
      );
      const grades = gradeResponse.data;

      const gradeCriterionsPromises = grades.map(async (grade) => {
        const criterionResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}api/criterions/${grade.criterion}`,
          headers,
        );
        const criterion = criterionResponse.data;

        return { grade, criterion };
      });

      const gradeCriterions = await Promise.all(gradeCriterionsPromises);
      setGradesAndCriterions(gradeCriterions);
    } catch (error) {
      console.error("Grading failed:", error.message);
      setFetchError(true);
      setFetchErrorMessage(JSON.stringify(error.response.data, null, 2));
      setOpenPopup(true);
    }
  };
  // REQ_34
  const handleGradeUpload = async (updatedGradesAndCriterions) => {
    setUploadError(false);
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      };
      for (const pair of updatedGradesAndCriterions) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}api/grades/${pair.grade.id}/`,
          pair.grade,
          headers,
        );
      }
      console.log("Grades updated successfully");
      setOpenPopup(true);
      // REQ_34_END
    } catch (error) {
      console.error("Grade update failed:", error.message);
      setUploadError(true);
      setUploadErrorMessage(JSON.stringify(error.response.data, null, 2));
      setOpenPopup(true);
    }
  };

  useEffect(() => {
    handleGradeFetch();
  }, []);

  const handleBack = () => {
    setFetchError(false);
    setFetchErrorMessage("");
    setUploadError(false);
    setUploadErrorMessage("");
    setOpenPopup(false);
    navigate(-1);
  };

  return (
    <ThemeProvider theme={montserrat}>
      <div>
        <Navbar />
        <div className="back-btn">
          <BackButton clickHandler={handleBack} />
        </div>

        <Grid container justifyContent="center" alignItems="center">
          {entry && (
            <GradeEntryForm
              entryName={entry.entry_title}
              authorName={`${entry.contestants[0].name} ${entry.contestants[0].surname}`}
              age={entry.user}
              applicant={entry.user}
              entryFile={entry.entry_file}
              gradesAndCriterions={gradesAndCriterions}
              handleGradeUpload={handleGradeUpload}
            />
          )}
        </Grid>
        <ConfirmationWindow
          open={openPopup}
          setOpen={setOpenPopup}
          title={
            fetchError
              ? "Nie udało się pobrać zgłoszenia"
              : uploadError
                ? "Nie udało się zapisać ocen"
                : "Pomyślnie zapisano oceny"
          }
          message={
            fetchError
              ? fetchErrorMessage
              : uploadError
                ? uploadErrorMessage
                : null
          }
          onConfirm={() => setOpenPopup(false)}
          showCancelButton={false}
        />
      </div>
    </ThemeProvider>
  );
};

export default GradeEntry;
