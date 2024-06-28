import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import useCustomLogin from '../hooks/useCustomLogin';
import {
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { getTotalProduct } from '../api/productApi';
import { getTotalSupplier } from '../api/supplierApi';
import { getTotalTransaction } from '../api/transactionApi';

const DashboardPage = () => {
  const {isLogin, moveToLogin} = useCustomLogin()

  const [product, setProduct] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [supplier, setSupplier] = useState(0)

  useEffect(() => {
    if (!isLogin) {
      moveToLogin();
    } else {
      getTotalProduct().then(data => {
        setProduct(data)
      })
      getTotalSupplier().then(data => {
        setSupplier(data)
      })
      getTotalTransaction().then(data => {
        setTotalPrice(data)
      })
    }
  }, [isLogin]);

  if(!isLogin){
    return moveToLogin();
  }
  
  return (
    <MainLayout>
      <div className='d-flex justify-content-center'>
        <Card className="dashboard-card">
          <CardBody>
            <CardTitle tag="h3" className='font-weight-bold text-center'>
              Product
            </CardTitle>
            <CardTitle className='text-center mt-3'>
              {product}個
            </CardTitle>
          </CardBody>
        </Card>
        <Card className="ml-5 dashboard-card">
          <CardBody>
            <CardTitle tag="h3" className='font-weight-bold text-center'>
              Total Price
            </CardTitle>
            <CardTitle className='text-center mt-3'>
              {totalPrice.toLocaleString()}円
            </CardTitle>
          </CardBody>
        </Card>
        <Card className="ml-5 dashboard-card">
          <CardBody>
            <CardTitle tag="h3" className='font-weight-bold text-center'>
              Supplier
            </CardTitle>
            <CardTitle className='text-center mt-3'>
              {supplier}社
            </CardTitle>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;