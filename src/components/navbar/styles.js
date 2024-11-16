
import { Link } from "react-router-dom";
import styled, { keyframes } from 'styled-components';

export const Nav = styled.nav`
  background-color: #f3ebe6;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  position: fixed;
  z-index: 10;
  align-items: center;
`;

export const NavContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 1300px;
  width: 100%;
`;

export const LogoDiv = styled.div`
  width: 100%;
`;

export const LogoContainer = styled(Link)`
  width: 100%;
  font-size: 1.5rem;
  text-decoration: none;
  color: #dcdada;
  img {
    width: 6%;
    border-radius: 50%;
    @media (max-width: 425px) {
      width: 10%;
    }
  }
`;

export const LinksDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const Hamburger = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;
// **************

// Animation for fade and slide effect
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Menu = styled.div`
  display: flex;
  padding: 10px;
  color: #6b6b6b;
  gap: 1rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 40px;
    right: 0;
    background: #f3ebe6;
    width: 100%;
    z-index: 10;
    animation: ${({ isOpen }) => (isOpen ? fadeIn : "none")} 0.3s ease-in-out;
  }

  /* Hover effect for Menu, if needed in the future */
  &:hover {
    /* color: white; */
  }
`;

export const MenuLink = styled(Link)`
  text-decoration: none;
  font-family: sans-serif;
  color: black;
  position: relative;
  /* padding: 0.5rem; */

  &:hover {
    color: #a57355;
  }
`;

export const SubMenu = styled.ul`
  display: ${({ isSubMenuOpen }) => (isSubMenuOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  padding: 0;
  margin: 0;
  list-style: none;
  border: 1px solid #ddd;
  width: 200px; /* Adjust width to your needs */
  z-index: 10;
  animation: ${({ isSubMenuOpen }) =>
    isSubMenuOpen ? fadeIn : "none"} 0.3s ease-in-out;

  li {
    padding: 0.5rem;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  li:hover {
    background-color: #a57355;
    color: white;
  }
`;

export const LogoutDiv = styled.div`
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    position: absolute;
    bottom: 1rem;
    padding: 14px;
    right: 1rem;
  }
`;

export const LogoutButton = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #0b6ea7;
  transition: background-color 0.3s ease;

  &:hover {
    background: #0b6ea7;
  }
`;
