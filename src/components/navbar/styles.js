import { Link } from "react-router-dom";
import styled from 'styled-components';

export const Nav = styled.nav`
  background-color: #f3ebe6;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  position: fixed;
  z-index: 15;
  align-items: center;
`;

export const NavContainer = styled.div`
  display: flex;
  padding: 10px;
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
  margin-left:-50px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const Menu = styled.div`
  display: flex;
align-items: center;
padding:5px;
justify-content: center;
  // color: #6b6b6b;
  gap: 1rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    justify-content: start;

    flex-direction: column;
    position: absolute;
    top: 70px;
    right: 10px;

    background: #f3ebe6;
    width: 60%;
    z-index: 10;
  }
`;

export const MenuLink = styled(Link)`
  text-decoration: none;
  font-family: sans-serif;
  color: black;
  position: relative;

  &:hover {
    color: #a57355;
  }
`;

export const SubMenu = styled.ul`
  display: ${({ isSubMenuOpen }) => (isSubMenuOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  right: 10px;
  background-color: white;
  padding: 0;
  margin: 0;
  list-style: none;
  z-index: 10;

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
