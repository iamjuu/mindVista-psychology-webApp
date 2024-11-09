import React from 'react';
import { Button } from './style';

const Index = ({ btnName = "Button", width, fontsize, color  ,bg,onClick}) => {
  return (
    <Button onClick={onClick} fontsize={fontsize}  color={color} bg={bg} width={width}> 
      {btnName}
    </Button>
  );
}

export default Index;