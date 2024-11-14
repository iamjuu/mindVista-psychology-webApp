// Programs.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { ProgramSectionOne } from '../../../constant/datas';
import { Container, BgContainer } from '../landing/Style';

const Programs = () => {
  const { program } = useParams(); // Get the dynamic parameter from the URL
  const programData = ProgramSectionOne[program]; // Get the data for the current program

  return (
    <Container>
      <BgContainer>
        {programData ? (
          <div>
            <h1>{programData.h1}</h1>
            <img src={programData.img} alt={programData.h1} />
            <p>{programData.p}</p>
          </div>
        ) : (
          <h1>Program not found</h1> // Display this if the program is invalid
        )}
      </BgContainer>
    </Container>
  );
};

export default Programs;
