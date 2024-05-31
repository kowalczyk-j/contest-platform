import React, { useState, useEffect } from "react";
import { TextField, IconButton, MenuItem } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";

function CreateCriterion({ index, onCriterionChange, onCriterionRemove }) {
  const [description, setDescription] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [usersOptions, setUsersOptions] = useState([]);

  useEffect(() => {
    onCriterionChange(index, {
      description,
      max_rating: maxRating,
      user: selectedOption,
    });
  }, [description, maxRating, selectedOption]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/users/jury_users/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        const users = response.data;
        const options = users.map((user) => ({
          value: user.id,
          label: user.username,
        }));
        setUsersOptions(options);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania użytkowników:", error);
      });
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="criterion">
      {index > 1 ? (
        <IconButton
          onClick={onCriterionRemove}
          aria-label="delete"
          style={{ height: "40px", width: "40px", marginTop: "8px" }}
        >
          <RemoveCircleOutlineIcon style={{ color: "#E95830" }} />
        </IconButton>
      ) : (
        <div style={{ height: "40px", width: "40px" }}></div>
      )}

      <div className="circle">{index}</div>
      <TextField
        required
        className="description"
        label="Opis"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        required
        className="max-rating"
        label="Punktacja"
        variant="outlined"
        type="number"
        InputLabelProps={{ shrink: true }}
        value={maxRating}
        onChange={(e) => setMaxRating(e.target.value)}
      />
      <TextField
        select
        label="Oceniający"
        variant="outlined"
        value={selectedOption}
        onChange={handleOptionChange}
        style={{ width: 200 }}
      >
        {usersOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

export default CreateCriterion;
