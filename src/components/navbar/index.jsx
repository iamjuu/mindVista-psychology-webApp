import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import {
  Hamburger,
  LinksDiv,
  LogoContainer,
  LogoDiv,
  Menu,
  Nav,
  NavContainer,
  MenuLink,
  SubMenu,
} from "./styles";
import LogOutbtn from "../core/button/";
import { Logo } from "../../assets/";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [hovered, setHovered] = useState(false); // For submenu hover control
  const navigate = useNavigate();

  const navigatePage = (program) => {
    navigate(`/programs/${program}`);
    setIsOpen(false); // Close the menu after navigation
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const dasboardfunction = ()=> {
navigate('/dashboard')
  }
  return (
    <Nav>
      <NavContainer>
        <LogoDiv>
          <LogoContainer to="/">
            <img   onDoubleClick={dasboardfunction} src={Logo} alt="Logo" />
          </LogoContainer>
        </LogoDiv>
        <LinksDiv>
          <Hamburger onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </Hamburger>
          <Menu isOpen={isOpen}>
            <MenuLink to="/">Home</MenuLink>
            <MenuLink to="/about">About</MenuLink>
            <MenuLink to="/contact">Contact</MenuLink>
            {/* Programs with Submenu */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ position: "relative" }}
            >
              <MenuLink as="span">Programs</MenuLink>
              <SubMenu isSubMenuOpen={hovered}>
                <li onClick={() => navigatePage("MindfulnessMeditation")}>Mindfulness Meditation</li>
                <li onClick={() => navigatePage("grief")}>Solution-Focused Brief Therapy</li>
                <li onClick={() => navigatePage("self")}>Behavioral Issues in Children</li>
                <li onClick={() => navigatePage("kids-family")}>Learning Disabilities</li>
                <li onClick={() => navigatePage("future-planning")}>Career Coaching for Young Adults</li>
                <li onClick={() => navigatePage("stress-management")}>Stress Management Therapy</li>
                <li onClick={() => navigatePage("old-age")}>Parenting Counseling</li>
                <li onClick={() => navigatePage("old-age")}>Financial Stress Counseling</li>
                <li onClick={() => navigatePage("eco-therapy")}>Eco Therapy</li>
                <li onClick={() => navigatePage("art-music-therapy")}>Art or Music Therapy</li>
              </SubMenu>
            </div>
            {isOpen && <LogOutbtn btnName={"register"} bg={"#A57355"} />}
          </Menu>
        </LinksDiv>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
