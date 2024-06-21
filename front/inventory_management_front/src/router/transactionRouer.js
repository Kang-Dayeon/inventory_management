import React, { lazy, Suspense } from 'react';
import { Spinner } from "reactstrap";
import { Navigate } from 'react-router-dom';

const Loading = <div className='container-fluid d-flex justify-content-center'><Spinner>Loading...</Spinner></div>
const TransactionList = lazy(() => import("../pages/transaction/ListPage"))
const TransactionAdd = lazy(() => import("../pages/transaction/AddPage"))

const transactionRouer = () => {
  return [
    {
      path: "",
      element: <Navigate replace={true} to={'list'} />
    },
    {
      path: "list",
      element: <Suspense fallback={Loading}><TransactionList /></Suspense>
    },
    {
      path: "add/:productId",
      element: <Suspense fallback={Loading}><TransactionAdd /></Suspense>
    },
  ];
};

export default transactionRouer;