import React from 'react';
import Logo from '../static/assets/Logo.png';

function Header() {
    return (
    <div className="logo">
        <img src={Logo} alt="Logo" />
    </div>
    )
}

export default Header;