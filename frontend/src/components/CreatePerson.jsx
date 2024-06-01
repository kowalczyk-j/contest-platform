import React, { useState, useEffect } from "react";
import { TextField, FormControl } from "@mui/material";

function CreatePerson({ index, onPersonChange }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  useEffect(() => {
    onPersonChange(index, { name, surname });
  }, [name, surname]);

  return (
    <div className="person">
      <div className="name">
        <FormControl className="flex flex-col space-y-4" fullWidth={true}>
          <TextField
            required
            id="participant-name"
            label="Imię uczestnika"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
      </div>

      <div className="surname">
        <FormControl className="flex flex-col space-y-4" fullWidth={true}>
          <TextField
            required
            id="participant-surname"
            label="Nazwisko uczestnika"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </FormControl>
      </div>
    </div>
  );
}

export default CreatePerson;
