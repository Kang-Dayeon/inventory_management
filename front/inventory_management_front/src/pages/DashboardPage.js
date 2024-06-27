import React from 'react';
import MainLayout from '../layouts/MainLayout';
import useCustomLogin from '../hooks/useCustomLogin';

const DashboardPage = () => {
  const {isLogin, moveToLogin} = useCustomLogin()

  if(!isLogin){
    return moveToLogin();
  }
  
  return (
    <MainLayout>
      Dashboard
    </MainLayout>
  );
};

export default DashboardPage;