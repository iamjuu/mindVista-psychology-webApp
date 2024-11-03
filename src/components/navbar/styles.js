// styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Nav = styled.nav`
  background-color: #F3EBE6;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1300px;
  padding: 10px;
  width: 100%;
`;

export const LogoDiv = styled.div``;

export const Logo = styled(Link)`
  font-size: 1.5rem;
  text-decoration: none;
  padding: 5px;
  color: #dcdada;
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

export const Menu = styled.div`
  display: flex;
  color: #dcdada;
  gap: 1rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 0;
    background: #dcdada;
    width: 100%;
  }
`;

export const MenuLink = styled(Link)`
  text-decoration: none;
  font-family: sans-serif;
  padding: 0.5rem;
  color: black;
  
  &:hover {
    color: brown;
  }
`;

export const LogoutDiv = styled.div`
background-color: red;
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
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
  background: #a57355;
  border-radius: 4px;

  &:hover {
    background: #0b6ea7;
  }
`;
