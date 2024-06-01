import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  FormControl,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import FileUploadButton from "./buttons/FileUploadButton";
import SubmitButton from "./buttons/SubmitButton";
import TextButton from "./buttons/TextButton";
import CreatePerson from "./CreatePerson";
import ConfirmationWindow from "./ConfirmationWindow";
import { uploadFile } from "./uploadFile";

function EntryForm({ contestId, onSubmit }) {
  // get contest info
  const [contest, setContest] = useState(null);

  // get user info
  const [user, setUser] = useState(null);

  // entry info
  const [email, setEmail] = useState("");
  const [entryTitle, setEntryTitle] = useState("");

  // loading - set to true until contest info is loaded
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setContest(response.data);
        axios
          .get(`${import.meta.env.VITE_API_URL}api/users/current_user/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + sessionStorage.getItem("accessToken"),
            },
          })
          .then((response) => {
            setUser(response.data);
            // automatically set email to logged users email
            setEmail(response.data.email);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [contestId]);

  // pop up after submiting
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    if (errorMessage === "") {
      navigate("/");
    } else {
      setErrorMessage("");
    }
  };

  // add person - only for group contests
  const [persons, setPersons] = React.useState([{ name: "", surname: "" }]);
  const handlePersonChange = (index, personData) => {
    setPersons((prevPersons) => {
      const newPersons = [...prevPersons];
      newPersons[index] = personData;
      return newPersons;
    });
  };

  const [personComponents, setPersonComponents] = React.useState([
    <CreatePerson index={0} onPersonChange={handlePersonChange} key={0} />,
  ]);
  const handleClickAddPerson = () => {
    setPersonComponents((prevComponents) => [
      ...prevComponents,
      <CreatePerson
        index={personComponents.length}
        onPersonChange={handlePersonChange}
        key={personComponents.length}
      />,
    ]);
  };

  // file upload
  // # REQ_25
  const [file, setFile] = React.useState(null);
  const [fileText, setFileText] = React.useState("Nie załączono pliku");
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    const filename =
      uploadedFile.name.length > 25
        ? `${uploadedFile.name.slice(0, 25)}...`
        : uploadedFile.name;
    setFileText(`Załączono pracę: ${filename}`);
  };
  // # REQ_25_END

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await onSubmit({
        contest: contestId,
        user: user.id,
        contestants: persons,
        email,
        entry_title: entryTitle,
      });

      if (response && response.status === 201) {
        setOpen(true);
        if (file) {
          // file is uploaded to cloud storage only after making sure entry is valid
          const filePath = await uploadFile("entries", file);
          console.log(filePath);
          const updateResponse = await axios.patch(
            `${import.meta.env.VITE_API_URL}api/entries/${response.data.id}/`,
            {
              entry_file: filePath,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + sessionStorage.getItem("accessToken"),
              },
            }
          );
          if (updateResponse.status !== 200) {
            console.error("Error updating entry:", updateResponse.status);
          }
        }
      }
    } catch (error) {
      setErrorMessage(JSON.stringify(error.response.data, null, 2));
      setOpen(true);
      console.error("Error: ", error);
    }
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      <Typography
        variant="h4"
        style={{ fontWeight: "bold", letterSpacing: 1.3 }}
      >
        {contest.title}
      </Typography>
      <Typography variant="body1" style={{ fontWeight: "lighter" }}>
        {contest.description}
      </Typography>
      {contest.rules_pdf && (
        <TextButton
          style={{ fontSize: "1rem", color: "#95C21E" }}
          endIcon={<ArrowForwardIcon />}
          href={contest.rules_pdf}
        >
          Regulamin
        </TextButton>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* # REQ_23 */}
        {personComponents}
        {!contest.individual && (
          <TextButton
            style={{ fontSize: 16, marginTop: "10px" }}
            startIcon={<AddCircleOutline style={{ color: "#95C21E" }} />}
            onClick={handleClickAddPerson}
          >
            Dodaj uczestnika
          </TextButton>
        )}
        {/* # REQ_23_END */}

        <div className="email">
          <FormControl className="flex flex-col space-y-4" fullWidth={true}>
            <TextField
              required
              label="Adres e-mail"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </div>

        <div className="entry-title">
          <FormControl className="flex flex-col space-y-4" fullWidth={true}>
            <TextField
              required
              id = "title"
              label="Tytuł pracy"
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
            />
          </FormControl>
        </div>

        {/* # REQ_27 */}
        <div className="checkbox">
          <FormControlLabel
            required
            control={<Checkbox id="consent-checkbox" />}
            label={
              <Typography style={{ fontSize: "0.7rem", fontWeight: "lighter" }}>
                Wyrażam zgodę na przetwarzanie zawartych w niniejszym formularzu
                zgłoszeniowym moich danych osobowych w postaci imienia,
                nazwiska, telefonu i maila kontaktowego przez Fundację Bo Warto,
                z siedzibą w Warszawie (00-713) przy ul. Batalionu AK „Bałtyk
                7/U3, w celu udziału w Konkursie Rodzinna recenzja książki dla
                dzieci, zgodnie z art. 6 ust. 1 lit. a Rozporządzenia Parlamentu
                Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 roku
                w sprawie ochrony osób fizycznych w związku z przetwarzaniem
                danych osobowych i w sprawie swobodnego przepływu takich danych
                oraz uchylenia dyrektywy 95/46/WE (RODO). Jeśli zechce Pan/Pani
                usunąć swoje dane proszę o kontakt z Fundacją BO WARTO, tel. 602
                228 732 mail: biuro@fundacjabowarto.pl.
              </Typography>
            }
          />
        </div>
        {/* # REQ_27_END */}

        <div className="entry-buttons">
          <div className="uploads">
            <FileUploadButton
              name="Załącz pracę"
              onFileChange={handleFileChange}
              fileType={
                contest && contest.type === "plastyczne"
                  ? "image/*"
                  : contest && contest.type === "literackie"
                    ? "application/pdf"
                    : ["image/*", "application/pdf"]
              }
            />
          </div>

          <div className="submit">
            <SubmitButton text="Zgłoś swoją pracę" onClick={() => {}} />
            <ConfirmationWindow
              open={open}
              setOpen={setOpen}
              title={
                errorMessage
                  ? "Wystąpił błąd przy dodawaniu zgłoszenia"
                  : "Dodano nowe zgłoszenie"
              }
              message={
                errorMessage || "Zostaniesz przekierowany do strony głównej"
              }
              onConfirm={handleClose}
              showCancelButton={false}
            />
          </div>
        </div>

        <Typography
          variant="body1"
          style={{
            fontWeight: "lighter",
            marginTop: "15px",
            marginLeft: "40px",
          }}
        >
          {fileText}
        </Typography>
      </form>
    </>
  );
}

export default EntryForm;
