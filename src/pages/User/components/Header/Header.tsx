import React from 'react';
import { Button } from '@mui/material';
//import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import "./Header.css"
//import { setSearchUser } from '@/redux/userSlice';


const Header: React.FC = () => {
  //const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("create")
  };

  return (
    <div className='header'>
      <div>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Crear Usuario
        </Button>
      </div>
    </div>
  );
};

export default Header;