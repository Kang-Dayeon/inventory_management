import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Spinner } from "reactstrap";

const Loading = <div className='container-fluid d-flex justify-content-center'><Spinner>Loading...</Spinner></div>
const ProductList = lazy(() => import("../pages/Product"))
const DashboardPage = lazy(() => import("../pages/DashboardPage"))

const root = createBrowserRouter ([
  {
    path: "",
    element: <Suspense fallback={Loading}><DashboardPage /></Suspense>
  },
  {
    path: "product",
    element: <Suspense fallback={Loading}><ProductList /></Suspense>
  }
]);

export default root;