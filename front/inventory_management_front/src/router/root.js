import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Spinner } from "reactstrap";
import productRouter from './productRouter';
import supplierRouter from './supplierRouter';

const Loading = <div className='container-fluid d-flex justify-content-center'><Spinner>Loading...</Spinner></div>
const Product = lazy(() => import("../pages/product/IndexPage"))
const Supplier = lazy(() => import("../pages/supplier/IndexPage"))
const DashboardPage = lazy(() => import("../pages/DashboardPage"))

const root = createBrowserRouter ([
  {
    path: "",
    element: <Suspense fallback={Loading}><DashboardPage /></Suspense>
  },
  {
    path: "product",
    element: <Suspense fallback={Loading}><Product /></Suspense>,
    children: productRouter()
  },
  {
    path: "supplier",
    element: <Suspense fallback={Loading}><Supplier /></Suspense>,
    children: supplierRouter()
  }
]);

export default root;