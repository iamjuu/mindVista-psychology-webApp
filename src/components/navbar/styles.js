// styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Nav = styled.nav`
  background-color: #F3EBE6;
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
    top: 40px;
    right: 0;
    background: #f3ebe6;
    width: 100%;
    z-index: 10;
  }
`;

export const MenuLink = styled(Link)`
  text-decoration: none;
  font-family: sans-serif;
  padding: 0.5rem;
  color: black;
  position: relative;

  &:hover {
    color: #1D1614;
  }

  &:hover .SubMenu {
    display: block;
  }
`;

 export const SubMenu = styled.ul`
  display: none;
  position: absolute;
  z-index: 10;
  top: 100%;
  left: 0;
  background-color: white;
  padding: 0;
  margin: 0;
  list-style: none;
  border: 1px solid #ddd;
@media (max-width:768px) {
}
  li {
    padding: 0.5rem;
    white-space: nowrap;
  }

  li:hover {
    background-color: #f0f0f0;
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
