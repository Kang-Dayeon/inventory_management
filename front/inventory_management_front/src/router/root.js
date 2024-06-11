import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import Product from '../pages/Product';

const root = createBrowserRouter ([
  {
    path: "",
    element: <DashboardPage />
  },
  {
    path: "/product",
    element: <Product />
  }
]);

export default root;