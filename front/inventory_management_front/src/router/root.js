import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons"

const Loading = <div><FontAwesomeIcon icon={faSpinner} /></div>
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