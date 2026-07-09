import React from 'react';
import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import "./Header.css"

const Header: React.FC = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("create")
  };


  return (
    <div className='header'>
      <div>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Crear Proveedor
        </Button>
      </div>
    </div>
  );
};

export default Header;
