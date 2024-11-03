// Navbar.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMenu, FiX } from 'react-icons/fi';
import { Hamburger, LinksDiv, Logo, LogoDiv, LogoutButton, LogoutDiv, Menu, MenuLink, Nav, NavContainer } from './styles';
import LogOutbtn from "../core/button/"
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
            <MenuLink href="/">Home</MenuLink>
            <MenuLink href="/about">About</MenuLink>
            <MenuLink href="/services">Services</MenuLink>
            <MenuLink href="/contact">Contact</MenuLink>
          </Menu>
        </LinksDiv>
        <LogoutDiv>
<LogOutbtn  btnName={'register'} width="130px"/>
        </LogoutDiv>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
