import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

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

  th, td {
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
    th, td {
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
  const [formData, setFormData] = useState(null); 
  const { id } = useParams(); 
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        if (!id) {
          console.error('No ID provided');
          return;
        }

        const response = await axios.get(`http://localhost:3000/formdata/${id}`);
        console.log(response.data, 'Data fetched by ID');
        setFormData(response.data.formData || null);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    }
    fetchFormData();
  },    [id]);
  console.log(formData,'form data');
  

  return (
    <TableContainer>
    <Title>Form and User Details</Title>
    <Table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {/* Display form data dynamically */}
        {formData
          ? Object.entries(formData).map(([key, value]) => (
              <tr key={key}>
                <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                <td>{value || 'N/A'}</td>
              </tr>
            ))
          : (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>No data available</td>
            </tr>
          )}
      </tbody>
    </Table>
    <ButtonContainer>
      <CheckoutButton>Checkout</CheckoutButton>
    </ButtonContainer>
  </TableContainer>

  );
}

export default DetailsPage;
