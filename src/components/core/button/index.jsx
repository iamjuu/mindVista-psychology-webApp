import React from 'react';
import { Button } from './style';

const Index = ({ btnName = "Button", width, fontsize, color ,border ,bg,onClick}) => {
  return (
    <Button onClick={onClick} fontsize={fontsize} border={border} color={color} bg={bg} width={width}> 
      {btnName}
    </Button>
  );
}

export default Index;