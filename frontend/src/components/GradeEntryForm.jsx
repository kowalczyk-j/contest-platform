import { ThemeProvider } from "@mui/material/styles";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/500.css";
import { Typography } from "@mui/material";
import FileDownloadButton from "./buttons/FileDownloadButton";
import SubmitButton from "./buttons/SubmitButton";
import GradeUpperCardInfo from "./GradeUpperCardInfo";
import GradeCriterionCard from "./GradeCriterionCard";
import montserrat from "../static/theme";
import { useState } from "react";
import { useEffect } from "react";

function GradeEntryForm({
  entryName,
  authorName,
  age,
  applicant,
  entryFile,
  gradesAndCriterions,
  handleGradeUpload,
  viewConfirmation
}) {
  const [updatedGradesAndCriterions, setUpdatedGradesAndCriterions] =
    useState(gradesAndCriterions);

  const handleGradeChange = (index, value) => {
    const newArray = [...updatedGradesAndCriterions];
    newArray[index].grade.value = value;
    setUpdatedGradesAndCriterions(newArray);
  };

  const handleCommentChange = (index, text) => {
    const newArray = [...updatedGradesAndCriterions];
    newArray[index].grade.description = text;
    setUpdatedGradesAndCriterions(newArray);
  };

  const handleGradeUploadClick = () => {
    handleGradeUpload(updatedGradesAndCriterions);
  };

  useEffect(() => {
    setUpdatedGradesAndCriterions(gradesAndCriterions);
  }, [gradesAndCriterions]);

  return (
    <>
      <div className="grade-entry-card">
        <div className="upper-grade-entry-card">
          <div className="upper-grade-entry-card-text">
            <Typography variant="h3">O pracy</Typography>
            <GradeUpperCardInfo
              entryName={entryName}
              authorName={authorName}
              age={age}
              applicant={applicant}
            />
            {entryFile && (
              <FileDownloadButton
                text="Pobierz pracę"
                link={new URL(entryFile).toString()}
              />
            )}
          </div>
          <div className="grade-entry-card-photo">
            {entryFile && entryFile.slice(-4) != ".pdf" && (
              <img
                src={entryFile}
                alt="zdjęcie pracy"
                width={200}
                size={200}
              ></img>
            )}
          </div>
        </div>

        <div>
          <Typography variant="h3">Kryteria oceny</Typography>
        </div>

        {gradesAndCriterions.map((pair, index) => (
          <GradeCriterionCard
            key={index}
            positionNumber={index + 1}
            grade={pair.grade}
            gradeCriterion={pair.criterion}
            setUpdatedGradesAndCriterions
            onGradeChange={(value) => handleGradeChange(index, value)}
            onCommentChange={(text) => handleCommentChange(index, text)}
            viewConfirmation={viewConfirmation}
          />
        ))}

        {viewConfirmation && (
          <SubmitButton
            className="grade-entry-card-commit-button"
            text="Zatwierdź ocenę"
            onClick={handleGradeUploadClick}
          />
        )}
      </div>
    </>
  );
}

export default GradeEntryForm;
