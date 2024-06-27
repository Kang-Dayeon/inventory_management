import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Outlet } from 'react-router-dom';
import useCustomLogin from '../../hooks/useCustomLogin';

const IndexPage = () => {
  const {isLogin, moveToLogin} = useCustomLogin()

  if(!isLogin){
    return moveToLogin();
  }
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default IndexPage;