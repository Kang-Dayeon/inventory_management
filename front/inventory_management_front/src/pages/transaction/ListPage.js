import React, {useState, useEffect} from 'react';
import moment from 'moment';
import { getList, removeOne, getSearchList } from '../../api/transactionApi';
import useCustomMove from '../../hooks/useCustomMove';
import PaginationComponent from '../../components/common/PaginationComponent';
import { 
  Table, 
  Button,
  Form,
  Row,
  Col,
  Input
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faFolderOpen,
  faFileArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { getAllList } from '../../api/productApi';
import { getReport } from '../../api/reportApi';

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
  const {page, size, refresh, moveToList, moveToModify} = useCustomMove()
  const [serverData, setServerData] = useState(initState)

  const [product, setProduct] = useState([])

  const [filter, setFilter] = useState({productId: '', dateRange: '', })
  const [reportUrl, setReportUrl] = useState('')

  const handleClickDelete = (transactionId) => {
    const confirm = window.confirm("本当に削除しますか？ \n 取引履歴を削除しても商品の在庫は変わりません❗️")
    if(confirm){
      removeOne(transactionId)
      moveToList()
    }
  }

  const handleFilterChange = (e) => {
    const {name, value} = e.target
    setFilter({
      ...filter,
      [name] : value
    })
  }

  const handleClickSearch = () => {
    getSearchList({page, size, ...filter}).then(data => {
      setServerData(data)
    })
  }

  const handleGenerateReport = () => {
    getReport({...filter}).then(data => {
      setReportUrl(data)
    })
  }

  useEffect(() => {
    if(reportUrl.length > 0){
      window.open(reportUrl, "_blank", "noopener, noreferrer")
    }
  }, [reportUrl])

  useEffect(() => {
    getAllList().then(data => {
      setProduct(data)
    });

    getList({page, size}).then(data => {
      setServerData(data)
    })
  }, [page, size, refresh])


  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h3 className='font-weight-bold'>取引リスト</h3>
        <div>
          <Form className='d-flex'>
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Col>
                <Input
                    name="productId"
                    type="select"
                    value={filter.productId}
                    onChange={handleFilterChange}
                  >
                    <option　value="">
                      商品
                    </option>
                    {product?.length > 0 ? (
                      product?.map(product => (
                        <option key={product.productId} value={product.productId}>{product.name}</option>
                      ))
                    ):(
                      <></>
                    )}
                </Input>
              </Col>
              <Col>
                <Input
                    name="dateRange"
                    type="select"
                    value={filter.dateRange}
                    onChange={handleFilterChange}
                  >
                    <option value="all">
                      期間
                    </option>
                    <option　value={"week"}>
                      1週
                    </option>
                    <option value={"month"}>
                      1ヶ月
                    </option>
                    <option value={"year"}>
                      １年
                    </option>
                </Input>
              </Col>
              <Button className='ml-2' onClick={handleClickSearch}>
                検索
              </Button>
              <Button className='ml-2' onClick={handleGenerateReport}>
                <FontAwesomeIcon icon={faFileArrowDown} /> Excel
              </Button>
            </Row>
          </Form>
        </div>
      </div>
        
        {/* table */}
        <Table className='mt-3' hover>
          <thead>
            <tr>
              <th className='text-center'>
                商品名
              </th>
              <th className='text-center'>
                取引金額
              </th>
              <th className='text-center'>
                取引数量
              </th>
              <th className='text-center'>
                取引日
              </th>
              <th className='text-center'>
                修正
              </th>
              <th className='text-center'>
                削除
              </th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList?.length > 0 ? (
              serverData.dtoList?.map((transaction) => 
                <tr>
                <td className='text-center'>
                  {transaction.productName}
                </td>
                <td className='text-end'>
                  {transaction.totalPrice.toLocaleString()}円
                </td>
                <td className='text-end'>
                  {transaction.quantity} 個
                </td>
                <td className='text-center'>
                  {moment(transaction.createdAt).format('YYYY.MM.DD')}
                </td>
                <td className='text-center'>
                  <button className='icon-btn' onClick={() => moveToModify(transaction.transactionId)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                </td> 
                <td className='text-center'>
                  <button className='icon-btn' onClick={() => handleClickDelete(transaction.transactionId)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
                </tr>
              )
            ):(
              <tr>
                <td colSpan='4' className='text-center'>
                  No DataData... <FontAwesomeIcon icon={faFolderOpen} />
                </td>
              </tr>
            )}
            
          </tbody>
        </Table>

        <PaginationComponent serverData={serverData} moveToPage={moveToList} pageName={"transaction"} />
      </div>
  );
};

export default ListPage;