import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { getList } from '../../api/supplierApi';
import useCustomMove from '../../hooks/useCustomMove';
import PaginationComponent from '../../components/common/PaginationComponent';
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
    navigate("/supplier/add")
  }, [])

  useEffect(() => {
    getList({page, size}).then(data => {
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
        <Table className='mt-3'>
          <thead>
            <tr>
              <th>
              </th>
              <th>
                Name
              </th>
              <th>
                Tel
              </th>
              <th>
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.map((supplier) => 
                <tr>
                <th scope="row">
                  {supplier.id}
                </th>
                <td>
                  {supplier.name}
                </td>
                <td>
                  {supplier.tel}
                </td>
                <td>
                  {supplier.email}
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