import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Hamburger, LinksDiv, Logo, LogoDiv, LogoutDiv, Menu, Nav, NavContainer,MenuLink } from './styles';
import LogOutbtn from "../core/button/";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Nav>
      <NavContainer>
        <LogoDiv>
          <Logo href="/">mindVista</Logo>
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
        <LogoutDiv>
          <LogOutbtn btnName="register" width="130px" />
        </LogoutDiv>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;