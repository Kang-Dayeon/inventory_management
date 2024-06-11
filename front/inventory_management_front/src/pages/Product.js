import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Table } from "reactstrap";

const dumyProducts = [
{
  id: 0,
  p_name: 'test1',
  p_description: 'test1',
  price: 1000,
  supplier: 'ttttt',
  quantity: 2
},
{
  id: 1,
  p_name: 'test2',
  p_description: 'test2',
  price: 1000,
  supplier: 'dddd',
  quantity: 13
},
{
  id: 2,
  p_name: 'test3',
  p_description: 'test3',
  price: 1000,
  supplier: 'sssce',
  quantity: 333
},
]

const Product = () => {
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
        {dumyProducts.map((product) => 
            <tr>
            <th scope="row">
              {product.id}
            </th>
            <td>
              {product.p_name}
            </td>
            <td>
              {product.p_description}
            </td>
            <td>
              {product.price}
            </td>
            <td>
              {product.quantity}
            </td>
            <td>
              {product.supplier}
            </td>
            </tr>
          )}
      </tbody>
    </Table>
    </MainLayout>
  );
};

export default Product;