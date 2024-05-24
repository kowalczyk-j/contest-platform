import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import {
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import SubmitButton from "./buttons/SubmitButton";
import CreateCriterion from "./CreateCriterion";
import TextButton from "./buttons/TextButton";
import FileUploadButton from "./FileUploadButton";
import { uploadFile } from "./uploadFile";
import ConfirmationWindow from "./ConfirmationWindow";

function ContestForm({ initialData = {}, editingMode = false, onSubmit }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [dateStart, setDateStart] = useState(
    dayjs(initialData.date_start) || dayjs().format("YYYY-MM-DD")
  );
  const [dateEnd, setDateEnd] = useState(
    dayjs(initialData.date_end) || dayjs().format("YYYY-MM-DD")
  );
  const [individual, setIndividual] = useState(
    initialData.individual ? "1" : "0"
  );
  const [type, setType] = useState(
    initialData.type === "plastyczne" || initialData.type === "literackie"
      ? initialData.type
      : "inne"
  );

  const [otherType, setOtherType] = useState(
    initialData.type !== "plastyczne" && initialData.type !== "literackie"
      ? initialData.type
      : ""
  );
  const [status, setStatus] = useState(initialData.status || "not_started");
  const statusChoices = {
    not_started: "Nierozpoczęty",
    ongoing: "W trakcie trwania",
    judging: "W trakcie oceny",
    finished: "Zakończony",
  };

  const [criteria, setCriteria] = useState([
    { contest: "", description: "", maxRating: "", user: "" },
  ]);

  // pop up after submiting
  const [open, setOpen] = React.useState(false);
  // error message if submit failed
  const [errorMessage, setErrorMessage] = React.useState("");

  // closing pop-up
  const handleClose = () => {
    setOpen(false);
    if (errorMessage === "") {
      navigate("/");
    } else {
      setErrorMessage("");
    }
  };

  // handler for changing criterion
  const handleCriterionChange = (index, criterionData) => {
    setCriteria((prevCriteria) => {
      const newCriteria = [...prevCriteria];
      newCriteria[index - 1] = criterionData;
      return newCriteria;
    });
  };

  // list of criterion components generated on page
  const [criteriaComponents, setCriteriaComponents] = useState([
    <CreateCriterion
      index="1"
      onCriterionChange={handleCriterionChange}
      key="0"
    />,
  ]);

  // handler for removing criterion
  const handleClickRemoveCriterion = (index) => {
    setCriteriaComponents((prevComponents) => {
      const newComponents = prevComponents.slice(0, index);
      for (let i = index; i < prevComponents.length - 1; i++) {
        newComponents.push(
          <CreateCriterion
            index={i + 1}
            onCriterionChange={handleCriterionChange}
            onCriterionRemove={() => {
              handleClickRemoveCriterion(i);
            }}
            key={i}
          />
        );
      }
      return newComponents;
    });

    setCriteria((prevCriterion) => {
      const newCriterion = [...prevCriterion];
      newCriterion.splice(index, 1);
      return newCriterion;
    });
  };

  // handler for adding new criterion
  const handleClickAddCriterion = () => {
    setCriteriaComponents((prevComponents) => [
      ...prevComponents,
      <CreateCriterion
        index={criteriaComponents.length + 1}
        onCriterionChange={handleCriterionChange}
        onCriterionRemove={() => {
          handleClickRemoveCriterion(criteriaComponents.length);
        }}
        key={criteriaComponents.length}
      />,
    ]);
  };

  // file uploads
  const [poster, setPoster] = React.useState(initialData.poster_img);
  const [posterText, setPosterText] = React.useState(
    initialData.poster_img ? "Załączono plakat" : "Nie załączono plakatu"
  );
  const handlePosterChange = (event) => {
    const file = event.target.files[0];
    setPoster(file);
    const filename =
      file.name.length > 25 ? `${file.name.slice(0, 23)}...` : file.name;
    setPosterText(filename);
  };

  // # REQ_11
  const [rulesFile, setRulesFile] = React.useState(initialData.rules_pdf);
  const [rulesText, setRulesText] = React.useState(
    initialData.rules_pdf ? "Załączono regulamin" : "Nie załączono regulaminu"
  );
  const handleRulesFileChange = (event) => {
    const file = event.target.files[0];
    setRulesFile(file);
    const filename =
      file.name.length > 25 ? `${file.name.slice(0, 23)}...` : file.name;
    setRulesText(filename);
  };
  // # REQ_11_END

  const handleSubmit = async (event) => {
    event.preventDefault();
    let finalType = type;
    if (type === "inne") {
      finalType = otherType;
    }

    try {
      const data = {
        title,
        description,
        date_start: dateStart.format("YYYY-MM-DD"),
        date_end: dateEnd.format("YYYY-MM-DD"),
        individual,
        type: finalType,
        status,
        criterion: criteria,
      };

      // Jeśli jesteśmy w trybie edycji, pobieramy identyfikator konkursu
      const contestId = editingMode ? initialData.id : null;

      // Aktualizujemy plakat i regulamin, jeśli są nowe pliki
      let posterPath = null;
      let rulesPath = null;
      if (poster instanceof File) {
        posterPath = await uploadFile("posters", poster);
      }
      if (rulesFile instanceof File) {
        rulesPath = await uploadFile("rules", rulesFile);
      }

      // Jeśli jesteśmy w trybie edycji, aktualizujemy dane konkursu
      if (editingMode) {
        // Aktualizacja istniejącego konkursu
        const contestResponse = await axios.patch(
          `${import.meta.env.VITE_API_URL}api/contests/${contestId}/`,
          {
            ...data,
            poster_img: posterPath,
            rules_pdf: rulesPath,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + sessionStorage.getItem("accessToken"),
            },
          }
        );

        if (contestResponse.status === 200) {
          setOpen(true);
        }
      } else {
        // Tworzenie nowego konkursu
        const { contestResponse, criterionResponse } = await onSubmit(data);

        if (
          contestResponse.status === 201 &&
          criterionResponse.every((response) => response.status === 201)
        ) {
          setOpen(true);

          await axios
            .patch(
              `${import.meta.env.VITE_API_URL}api/contests/${
                contestResponse.data.id
              }/`,
              {
                poster_img: posterPath,
                rules_pdf: rulesPath,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Token " + sessionStorage.getItem("accessToken"),
                },
              }
            )
            .catch((error) => {
              setErrorMessage(JSON.stringify(error.response.data, null, 2));
              setOpen(true);
            });
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(JSON.stringify(error.response.data, null, 2));
      setOpen(true);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="title">
        <FormControl className="flex flex-col space-y-4" fullWidth={true}>
          <TextField
            id="title"
            required
            label="Tytuł konkursu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
      </div>

      <div className="description">
        <FormControl className="flex flex-col space-y-2" fullWidth={true}>
          <TextField
            id="description"
            required
            label="Opis"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
      </div>

      <div className="dates">
        <LocalizationProvider adapterLocale="pl" dateAdapter={AdapterDayjs}>
          <DatePicker
            className="date"
            required
            label="Data rozpoczęcia"
            defaultValue={dateStart}
            format="DD-MM-YYYY"
            onChange={(date) => setDateStart(date)}
          />
          <DatePicker
            className="date"
            required
            label="Data zakończenia"
            defaultValue={dateEnd}
            format="DD-MM-YYYY"
            onChange={(date) => setDateEnd(date)}
          />
        </LocalizationProvider>
      </div>

      <div className="contest-type">
        <FormControl component="fieldset" className="flex flex-col space-y-2">
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Typ konkursu:
          </Typography>
          <RadioGroup
            row
            aria-label="type"
            required
            name="row-radio-buttons-group"
            value={individual}
            onChange={(e) => setIndividual(e.target.value)}
          >
            {/* # REQ_12*/}
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="indywidualny"
            />
            <FormControlLabel value="0" control={<Radio />} label="grupowy" />
            {/* # REQ_12_END */}
          </RadioGroup>
        </FormControl>
      </div>
      <div className="contest-type">
        <FormControl component="fieldset" className="flex flex-col space-y-2">
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Typ zgłoszeń:
          </Typography>
          <RadioGroup
            row
            aria-label="type"
            required
            name="row-radio-buttons-group"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex flex-wrap"
          >
            <FormControlLabel
              value="plastyczne"
              control={<Radio />}
              label="plastyczne / fotograficze"
            />
            <FormControlLabel
              value="literackie"
              control={<Radio />}
              label="literackie"
            />
            <div className="flex items-center">
              <FormControlLabel
                value="inne"
                control={<Radio />}
                label="inne:"
              />
              <TextField
                id="other"
                size="small"
                value={otherType}
                onChange={(e) => setOtherType(e.target.value)}
                style={{ marginLeft: 8 }}
              />
            </div>
          </RadioGroup>
        </FormControl>
      </div>

      {editingMode ? (
        <div className="status" style={{ marginTop: "15px" }}>
          <FormControl component="fieldset" className="flex flex-col space-y-2">
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              Status konkursu:
            </Typography>
            <RadioGroup
              row
              aria-label="status"
              required
              name="row-radio-buttons-group"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {Object.entries(statusChoices).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={value}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      ) : (
        <div className="criteria">
          <Typography variant="body1" style={{ fontWeight: "lighter" }}>
            Kryteria oceny:
          </Typography>
          {criteriaComponents}
          <TextButton
            style={{ fontSize: 16, marginTop: "10px" }}
            startIcon={<AddCircleOutline style={{ color: "#95C21E" }} />}
            onClick={handleClickAddCriterion}
          >
            Dodaj kryterium
          </TextButton>
        </div>
      )}

      <div className="uploads">
        <div className="rules">
          <FileUploadButton
            name="Załącz regulamin"
            onFileChange={handleRulesFileChange}
            fileType="application/pdf"
          />
          <Typography
            variant="body1"
            style={{ fontWeight: "lighter", marginTop: "15px" }}
          >
            {rulesText}
          </Typography>
        </div>

        <div className="poster">
          <FileUploadButton
            name="Załącz plakat"
            onFileChange={handlePosterChange}
            fileType="image/*"
          />
          <Typography
            variant="body1"
            style={{ fontWeight: "lighter", marginTop: "15px" }}
          >
            {posterText}
          </Typography>
        </div>
      </div>

      <div className="submit">
        <SubmitButton
          text={editingMode ? "Edytuj konkurs" : "Utwórz konkurs"}
          onClick={() => {}}
        />
        <ConfirmationWindow
          open={open}
          setOpen={setOpen}
          title={
            errorMessage
              ? "Wystąpił błąd przy uzupełnianiu formularza"
              : "Pomyślnie dodano konkurs"
          }
          message={errorMessage || "Zostaniesz przekierowany do strony głównej"}
          onConfirm={handleClose}
          showCancelButton={false}
        />
      </div>
    </form>
  );
}

export default ContestForm;
