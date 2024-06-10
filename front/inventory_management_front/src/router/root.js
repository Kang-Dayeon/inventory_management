import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

const root = createBrowserRouter ([
  {
    path: "",
    element: <DashboardPage />
  }
]);

export default root;