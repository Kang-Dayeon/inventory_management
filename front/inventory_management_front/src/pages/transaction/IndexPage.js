import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Outlet } from 'react-router-dom';

const IndexPage = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default IndexPage;