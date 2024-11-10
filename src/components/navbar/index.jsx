// Navbar.js
import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { 
  Hamburger, 
  LinksDiv, 
  LogoContainer, 
  LogoDiv, 
  LogoutDiv, 
  Menu, 
  Nav, 
  NavContainer, 
  MenuLink 
} from './styles';
import LogOutbtn from "../core/button/";
import { Logo } from "../../assets/";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Nav>
      <NavContainer>
        <LogoDiv>
          <LogoContainer to="/"> 
            <img src={Logo} alt="Logo" />
          </LogoContainer>
        </LogoDiv>
        <LinksDiv>
          <Hamburger onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </Hamburger>
          <Menu isOpen={isOpen}>
            <MenuLink to="/">Home</MenuLink>
            <MenuLink to="/about">About</MenuLink>
            <MenuLink to="/service">Services</MenuLink>
            <MenuLink to="/contact">Contact</MenuLink>
          </Menu>
        </LinksDiv>
        <LogoutDiv isOpen={isOpen}>
          <LogOutbtn color="white" bg="#a57355" btnName="Register" width="130px" />
        </LogoutDiv>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
