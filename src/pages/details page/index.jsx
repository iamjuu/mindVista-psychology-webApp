import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom'; // If using React Router

const TableContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  overflow-x: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
  }

  td {
    color: #333;
  }

  @media (max-width: 600px) {
    th,
    td {
      padding: 10px 8px;
      font-size: 14px;
    }
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #4CAF50;
  margin-bottom: 15px;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const CheckoutButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    transform: scale(0.98);
  }
`;

function DetailsPage() {
  const [form, setForm] = useState(null);
  const { id } = useParams(); // Get ID from route params

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/formdata/${id}`);
        console.log(response.data, 'Data fetched by ID');
        setForm(response.data);
      } catch (error) {
        console.error('Error fetching form data by ID:', error);
      }
    };

    if (id) fetchFormData(); 
  }, [id]);

  if (!form) {
    return <p>Loading...</p>; 
  }

  return (
    <TableContainer>
      <Title>Form Details</Title>
      <Table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{form.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{form.email}</td>
          </tr>
          <tr>
            <td>Phone Number</td>
            <td>{form.number}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>{form.location}</td>
          </tr>
          <tr>
            <td>Age</td>
            <td>{form.age}</td>
          </tr>
          <tr>
            <td>Slot</td>
            <td>{form.slot}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>{form.date}</td>
          </tr>
        </tbody>
      </Table>
      <ButtonContainer>
        <CheckoutButton>Checkout</CheckoutButton>
      </ButtonContainer>
    </TableContainer>
  );
}

export default DetailsPage;
