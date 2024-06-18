import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { getList } from '../../api/productApi';
import useCustomMove from '../../hooks/useCustomMove';
import PaginationComponent from '../../components/common/PaginationComponent';
import { 
  Table, 
  Button
} from "reactstrap";
import { useNavigate } from 'react-router-dom';

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

const ListPage = () => {
  const navigate = useNavigate()

  const {page, size, refresh, moveToList, moveToRead} = useCustomMove()
  const [serverData, setServerData] = useState(initState)

  const handleClickAdd = useCallback(() => {
    navigate("/product/add")
  }, [])

  useEffect(() => {
    getList({page, size}).then(data => {
      setServerData(data)
      console.log(data)
    })
  }, [page, size, refresh])

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h3 className='font-weight-bold'>Product List</h3>
        <Button className='font-weight-bold' onClick={handleClickAdd}>
          ADD Product
        </Button>
      </div>
      {/* table */}
      <Table className='mt-3'>
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
            <th>
              Create Date
            </th>
          </tr>
        </thead>
        <tbody>
          {serverData.dtoList.map((product) => 
              <tr onClick={() => moveToRead(product.productId)}>
              <th scope="row">
                {product.productId}
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
                {product.quantity}
              </td>
              <td>
                {product.supplier.name}
              </td>
              <td>
                {moment(product.createdAt).format('YYYY.MM.DD')}
              </td>
              </tr>
            )}
        </tbody>
      </Table>

      <PaginationComponent serverData={serverData} moveToPage={moveToList} pageName={"product"} />
    </div>
  );
};

export default ListPage;