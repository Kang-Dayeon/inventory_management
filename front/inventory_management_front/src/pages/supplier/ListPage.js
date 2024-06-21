import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { getList, removeOne } from '../../api/supplierApi';
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
    navigate("/supplier/add")
  }, [])

  const handleClickDelete = (supplierId) => {
    const confirm = window.confirm("本当に削除しますか？ \n❗️削除されると、その取引先に関連する商品も削除されます❗️")
    if(confirm){
      removeOne(supplierId)
      moveToList()
    }
  }

  useEffect(() => {
    getList({page, size}).then(data => {
      console.log(data)
      setServerData(data)
    })
  }, [page, size, refresh])

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h3 className='font-weight-bold'>Supplier List</h3>
        <Button className='font-weight-bold' onClick={handleClickAdd}>
          ADD Supplier
        </Button>
      </div>
        
        {/* table */}
        <Table className='mt-3' hover>
          <thead>
            <tr>
              <th className='text-center'>
                Name
              </th>
              <th className='text-center'>
                Tel
              </th>
              <th className='text-center'>
                Email
              </th>
              <th className='text-center'>
                modify
              </th>
              <th className='text-center'>
                delete
              </th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.length > 0 ? (
              serverData.dtoList.map((supplier) => 
                <tr>
                <td className='text-center'>
                  {supplier.name}
                </td>
                <td className='text-center'>
                  {supplier.tel}
                </td>
                <td className='text-center'>
                  {supplier.email}
                </td>
                <td className='text-center'>
                  <button className='icon-btn' onClick={() => moveToRead(supplier.supplierId)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                </td>
                <td className='text-center'>
                  <button className='icon-btn' onClick={() => handleClickDelete(supplier.supplierId)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
                </tr>
              )
            ):(
              <tr>
                <td colSpan='5' className='text-center'>
                  No DataData... <FontAwesomeIcon icon={faFolderOpen} />
                </td>
              </tr>
            )}
            
          </tbody>
        </Table>

        <PaginationComponent serverData={serverData} moveToPage={moveToList} pageName={"supplier"} />
      </div>
  );
};

export default ListPage;