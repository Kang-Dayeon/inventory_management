import React, { lazy, Suspense } from 'react';
import { Spinner } from "reactstrap";
import { Navigate } from 'react-router-dom';

const Loading = <div className='container-fluid d-flex justify-content-center'><Spinner>Loading...</Spinner></div>
const SupplierList = lazy(() => import("../pages/supplier/ListPage"))
const SupplierAdd = lazy(() => import("../pages/supplier/AddPage"))

const supplierRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace={true} to={'list'} />
    },
    {
      path: "list",
      element: <Suspense fallback={Loading}><SupplierList /></Suspense>
    },
    {
      path: "add",
      element: <Suspense fallback={Loading}><SupplierAdd /></Suspense>
    },
  ];
};

export default supplierRouter;