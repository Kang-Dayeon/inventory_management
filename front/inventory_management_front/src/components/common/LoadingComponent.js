import React from 'react';
import {
  Spinner
} from "reactstrap";

const LoadingComponent = () => {
  return (
    <div className='wrapper justify-content-center align-items-center'>
      <Spinner color="primary">
        Loading...
      </Spinner>
    </div>
  );
};

export default LoadingComponent;