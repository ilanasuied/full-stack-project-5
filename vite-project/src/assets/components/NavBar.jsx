import React from 'react';
import './NavBar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-button infoModal">Home</Link>
      <Link to="/about" className="nav-button">About</Link>
      <Link to="/services" className="nav-button">Services</Link>
      <Link to="/contact" className="nav-button">Contact</Link>
      <Link to="/profile" className="nav-button last-button">Profile</Link>
    </nav>
  );
}

export default Navbar;
