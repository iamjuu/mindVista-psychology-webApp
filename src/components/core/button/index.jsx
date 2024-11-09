import React from 'react';
import {Button} from './style'
const index = ({btnName,width}) => {
  return (
    <Button width={width}> 
      {btnName}
    </Button>
  );
}

export default index;
