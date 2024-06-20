import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getList } from '../../api/productApi';
import useCustomMove from '../../hooks/useCustomMove';
import PaginationComponent from '../../components/common/PaginationComponent';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen
} from "@fortawesome/free-solid-svg-icons";
import { 
  Table, 
  Button
} from "reactstrap";

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
              Create Date
            </th>
          </tr>
        </thead>
        <tbody>
          {serverData.dtoList.length > 0 ? (
            serverData.dtoList.map((product) => 
              <tr onClick={() => moveToRead(product.productId)}>
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
                {moment(product.createdAt).format('YYYY.MM.DD')}
              </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan='5' className='text-center'>
                No DataData... <FontAwesomeIcon icon={faFolderOpen} />
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