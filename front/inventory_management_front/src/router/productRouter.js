import React, { lazy, Suspense } from 'react';
import { Spinner } from "reactstrap";
import { Navigate } from 'react-router-dom';

const Loading = <div className='container-fluid d-flex justify-content-center'><Spinner>Loading...</Spinner></div>
const ProductList = lazy(() => import("../pages/product/ListPage"))
const ProductAdd = lazy(() => import("../pages/product/AddPage"))
const ProductDetail = lazy(() => import("../pages/product/DetailPage"))
const ProductModify = lazy(() => import("../pages/product/ModifyPage"))

const productRouter = () => {
  return [
    {
      path: "",
      element: <Navigate replace={true} to={'list'} />
    },
    {
      path: "list",
      element: <Suspense fallback={Loading}><ProductList /></Suspense>
    },
    {
      path: "add",
      element: <Suspense fallback={Loading}><ProductAdd /></Suspense>
    },
    {
      path: ":productId",
      element: <Suspense fallback={Loading}><ProductDetail /></Suspense>
    },
    {
      path: "modify/:productId",
      element: <Suspense fallback={Loading}><ProductModify /></Suspense>
    },
  ]
};

export default productRouter;