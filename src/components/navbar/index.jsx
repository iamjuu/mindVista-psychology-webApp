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
  const [isOpen, setIsOpen] = useState(false); // For mobile menu toggle
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
            <MenuLink to="/contact">Contact</MenuLink>
            {/* Programs with Submenu */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ position: "relative" }}
            >
              <MenuLink as="span">Programs</MenuLink>
              <SubMenu isSubMenuOpen={hovered}>
                <li onClick={() => navigatePage("dating")}>
                  Dating & Relationships
                </li>
                <li onClick={() => navigatePage("grief")}>
                  Grief & Loss Counseling
                </li>
                <li onClick={() => navigatePage("self")}>
                  Self-Esteem Therapy
                </li>
                <li onClick={() => navigatePage("kids-family")}>
                  Kids & Family
                </li>
                <li onClick={() => navigatePage("future-planning")}>
                  Life & Future Planning
                </li>
                <li onClick={() => navigatePage("old-age")}>Old Age Therapy</li>
              </SubMenu>
            </div>
            {isOpen && <LogOutbtn btnName={'register'}  bg={'#A57355'} />}
          </Menu>
        </LinksDiv>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
