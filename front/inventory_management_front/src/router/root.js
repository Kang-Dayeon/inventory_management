import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Spinner } from "reactstrap";
import productRouter from './productRouter';
import supplierRouter from './supplierRouter';
import transactionRouer from './transactionRouer';

const Loading = <div className='container-fluid d-flex justify-content-center'><Spinner>Loading...</Spinner></div>
const Product = lazy(() => import("../pages/product/IndexPage"))
const Supplier = lazy(() => import("../pages/supplier/IndexPage"))
const Transaction = lazy(() => import("../pages/transaction/IndexPage"))
const DashboardPage = lazy(() => import("../pages/DashboardPage"))
const LoginPage = lazy(() => import("../pages/auth/LoginPage"))

const root = createBrowserRouter ([
  {
    path: "",
    element: <Suspense fallback={Loading}><DashboardPage /></Suspense>
  },
  {
    path: "/login",
    element: <Suspense fallback={Loading}><LoginPage /></Suspense>
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
  },
  {
    path: "transaction",
    element: <Suspense fallback={Loading}><Transaction /></Suspense>,
    children: transactionRouer()
  }
]);

export default root;