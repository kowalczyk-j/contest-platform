import React from "react";
import { Link } from "react-router-dom";

function Header({ logoSize }) {
  return (
    <div className="logo">
      <Link to="/">
        <img
          src={"/Logo.png"}
          alt="Logo"
          style={{ width: logoSize, height: "auto" }}
        />
      </Link>
    </div>
  );
}

export default Header;
