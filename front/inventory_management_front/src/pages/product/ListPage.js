import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getList } from '../../api/productApi';
import useCustomMove from '../../hooks/useCustomMove';
import PaginationComponent from '../../components/common/PaginationComponent';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faCommentsDollar
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

  const handleClickTransaction = (productId) => {
    navigate(`/transaction/add/${productId}`, { replace: true })
  }

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
      <Table className='list-table mt-3' hover>
        <thead>
          <tr>
            <th className='text-center'>
              Name
            </th>
            <th className='text-center'>
              Description
            </th>
            <th className='text-center'>
              Price
            </th>
            <th className='text-center'>
              Quantity
            </th>
            <th className='text-center'>
              Create Date
            </th>
            <th style={{width: '200px'}} className='text-center'>
              Add Transaction
            </th>
          </tr>
        </thead>
        <tbody>
          {serverData.dtoList.length > 0 ? (
            serverData.dtoList.map((product) => 
              <tr onClick={() => moveToRead(product.productId)}>
              <td className='text-center'>
                {product.name}
              </td>
              <td className='text-center'>
                {product.description}
              </td>
              <td className='text-end'>
                {product.price.toLocaleString()}円
              </td>
              <td className='text-end'>
                {product.quantity} 個
              </td>
              <td className='text-center'>
                {moment(product.createdAt).format('YYYY.MM.DD')}
              </td>
              <td scope="row" className='text-center'>
                <button className='icon-btn' onClick={(e) => {e.stopPropagation(); handleClickTransaction(product.productId);}}>
                  <FontAwesomeIcon icon={faCommentsDollar} />
                </button>
              </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan='6' className='text-center'>
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