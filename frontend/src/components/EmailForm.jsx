import React, { useState } from "react";
import axios from "axios";

const EmailForm = () => {
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "pierwsza wiadomość",
  });

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_API_URL}api/contests/1/send_email/`,
        emailData
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="subject" onChange={handleChange} />
      <textarea name="body" onChange={handleChange} />
      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailForm;
