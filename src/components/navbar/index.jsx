import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
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
} from './styles';
import LogOutbtn from "../core/button/"; 
import { Logo } from "../../assets/";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State for submenu
  const navigate = useNavigate();

  const navigatePage = (program) => {
    navigate(`/programs/${program}`);
    setIsOpen(false); // Close the menu after navigation
    setIsSubMenuOpen(false); // Close the submenu
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen); // Toggle the visibility of the submenu
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
            <MenuLink to="/programs" onClick={toggleSubMenu}>Programs</MenuLink> {/* Trigger submenu toggle */}
            <SubMenu isSubMenuOpen={isSubMenuOpen}>
              <li><Link to="/program-dating" onClick={() => navigatePage('dating')}>Dating & Relationships</Link></li>
              <li><Link to="/program-grief" onClick={() => navigatePage('grief')}>Grief & Loss Counseling</Link></li>
              <li><Link to="/program-self" onClick={() => navigatePage('self')}>Self-Esteem Therapy</Link></li>
              <li><Link to="/program-kids" onClick={() => navigatePage('kids-family')}>Kids & Family</Link></li>
              <li><Link to="/program-future" onClick={() => navigatePage('future-planning')}>Life & Future Planning</Link></li>
              <li><Link to="/program-old" onClick={() => navigatePage('old-age')}>Old Age Therapy</Link></li>
            </SubMenu>
            {isOpen && <LogOutbtn color="white" bg="#a57355" btnName="Register" width="130px" />}
          </Menu>
        </LinksDiv>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
