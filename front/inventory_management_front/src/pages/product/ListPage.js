import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getList, getSearchList } from '../../api/productApi';
import useCustomMove from '../../hooks/useCustomMove';
import PaginationComponent from '../../components/common/PaginationComponent';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faCommentsDollar
} from "@fortawesome/free-solid-svg-icons";
import { 
  Table, 
  Button,
  Form,
  Row,
  Col,
  Input
} from "reactstrap";
import useCustomInput from '../../hooks/useCustomInput';

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
  const {inputData, handleChangeInput} = useCustomInput({productName: ''})

  const handleClickAdd = useCallback(() => {
    navigate("/product/add")
  }, [])

  const handleClickTransaction = (productId) => {
    navigate(`/transaction/add/${productId}`, { replace: true })
  }

  const handleClickSearch = () => {
    const productName = inputData.productName
    getSearchList({page, size, productName}).then(data => {
      setServerData(data)
    })
  }

  useEffect(() => {
    getList({page, size}).then(data => {
      setServerData(data)
    })
  }, [page, size, refresh])

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h3 className='font-weight-bold'>商品リスト</h3>
        <div className='d-flex'>
        <Form className='d-flex'>
          <Row className="row-cols-lg-auto g-3 align-items-center">
            <Col>
              <Input
                  name="productName"
                  type="text"
                  value={inputData.productName}
                  onChange={handleChangeInput}
                >
              </Input>
            </Col>
            <Button className='ml-2 font-weight-bold' onClick={handleClickSearch}>
              検索
            </Button>
            <Button className='font-weight-bold ml-2' onClick={handleClickAdd}>
              商品追加
            </Button>
          </Row>
        </Form>
        
        </div>
      </div>
      {/* table */}
      <Table className='list-table mt-3' hover>
        <thead>
          <tr>
            <th className='text-center'>
              商品名
            </th>
            <th className='text-center'>
              説明
            </th>
            <th className='text-center'>
              価額
            </th>
            <th className='text-center'>
              在庫
            </th>
            <th className='text-center'>
              作成日
            </th>
            <th style={{width: '200px'}} className='text-center'>
              取引追加
            </th>
          </tr>
        </thead>
        <tbody>
          {serverData.dtoList?.length > 0 ? (
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