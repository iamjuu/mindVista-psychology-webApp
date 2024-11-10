// styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Nav = styled.nav`
  background-color: #F3EBE6;
  width: 100%;
  height: 80px;
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

export const LogoDiv = styled.div` 
/* background-color:green; */
width: 100%;
`;

export const LogoContainer = styled(Link)`
  width: 100%;
  font-size: 1.5rem;
  text-decoration: none;
  /* background-color: red; */
  padding: 5px;
  color: #dcdada;
  img{
    width: 6%;
    border-radius: 50%;
    @media (max-width:425px) {
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

export const Menu = styled.div`
  display: flex;
  color: #dcdada;
  gap: 1rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 80px;
    right: 0;
    background: #f3ebe6;
    width: 100%;
    z-index: 10;
    /* padding: 1.2rem; */
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
  border-radius: 4px;

  &:hover {
    background: #0b6ea7;
  }
`;
