import React, {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getList } from '../../api/transactionApi';
import useCustomMove from '../../hooks/useCustomMove';
import PaginationComponent from '../../components/common/PaginationComponent';
import { 
  Table, 
  Button
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faFolderOpen
} from "@fortawesome/free-solid-svg-icons";

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
    navigate("/transaction/add")
  }, [])

  // const handleClickDelete = (supplierId) => {
  //   const confirm = window.confirm("本当に削除しますか？ \n❗️削除されると、その取引先に関連する商品も削除されます❗️")
  //   if(confirm){
  //     removeOne(supplierId)
  //     moveToList()
  //   }
  // }

  useEffect(() => {
    getList({page, size}).then(data => {
      console.log(data)
      setServerData(data)
    })
  }, [page, size, refresh])

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h3 className='font-weight-bold'>Transaction List</h3>
        <Button className='font-weight-bold' onClick={handleClickAdd}>
          ADD Transaction
        </Button>
      </div>
        
        {/* table */}
        <Table className='mt-3' hover>
          <thead>
            <tr>
              <th className='text-center'>
                Product Name
              </th>
              <th className='text-center'>
                Total Price
              </th>
              <th className='text-center'>
                Transaction Quantity
              </th>
              <th className='text-center'>
                Transaction Date
              </th>
              {/* <th className='text-center'>
                modify
              </th>
              <th className='text-center'>
                delete
              </th> */}
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((transaction) => 
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
                {/* <td className='text-center'>
                  <button className='icon-btn' onClick={() => moveToRead(supplier.supplierId)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                </td> */}
                {/* <td className='text-center'>
                  <button className='icon-btn' onClick={() => handleClickDelete(supplier.supplierId)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td> */}
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