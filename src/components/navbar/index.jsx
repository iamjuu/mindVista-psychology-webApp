// Navbar.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMenu, FiX } from 'react-icons/fi';
import { Hamburger, LinksDiv, Logo, LogoDiv, LogoutButton, LogoutDiv, Menu, MenuLink, Nav, NavContainer } from './styles';

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
            <MenuLink href="#home">Home</MenuLink>
            <MenuLink href="#about">About</MenuLink>
            <MenuLink href="#services">Services</MenuLink>
            <MenuLink href="#contact">Contact</MenuLink>
          </Menu>
        </LinksDiv>
        <LogoutDiv>
          <LogoutButton href="#logout">Logout</LogoutButton>
        </LogoutDiv>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
