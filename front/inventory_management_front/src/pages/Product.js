import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Table } from "reactstrap";
import useCustomMove from '../hooks/useCustomMove';
import { useEffect } from 'react';
import { getList } from '../api/productApi';

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
}

const Product = () => {
  const {page, size, refresh, moveToList, moveToRead} = useCustomMove()
  const [serverData, setServerData] = useState(initState);
  
  useEffect(() => {
    getList({page, size}).then(data => {
      console.log(data)
      setServerData(data)
    })
  }, [page, size, refresh])

  return (
    <MainLayout>
      <h3>Product List</h3>
      <Table>
      <thead>
        <tr>
          <th>
          </th>
          <th>
            Name
          </th>
          <th>
            Description
          </th>
          <th>
            Price
          </th>
          <th>
            Quantity
          </th>
          <th>
            Supplier
          </th>
        </tr>
      </thead>
      <tbody>
        {serverData.dtoList.map((product) => 
            <tr>
            <th scope="row">
              {product.id}
            </th>
            <td>
              {product.name}
            </td>
            <td>
              {product.description}
            </td>
            <td>
              {product.price}
            </td>
            <td>
              재고
              {/* {product.quantity} */}
            </td>
            <td>
              거래처
              {/* {product.supplier} */}
            </td>
            </tr>
          )}
      </tbody>
    </Table>
    </MainLayout>
  );
};

export default Product;