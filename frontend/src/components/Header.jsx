import React from "react";
import Logo from "../static/assets/Logo.png";

function Header({ logoSize }) {
  return (
    <div className="logo">
      <img src={Logo} alt="Logo" style={{ width: logoSize, height: "auto" }} />
    </div>
  );
}

export default Header;
