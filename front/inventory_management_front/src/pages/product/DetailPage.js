import React, { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { getOne, removeOne } from '../../api/productApi';
import { getSupplierOne } from '../../api/supplierApi';
import { 
  Card, 
  CardBody, 
  CardHeader,
  ListGroupItemHeading,
  CardTitle,
  List,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
  Button 
}from 'reactstrap';
import { useParams } from 'react-router-dom';

const initState = {
  name: '',
  description: '',
  price: 0,
  uploadFileName: [],
  quantity: 0,
  supplierId: null,
  createAt: ''
}

const initSupplier = {
  name: '',
  tel: '',
  email: ''
}

const DetailPage = () => {
  const {productId} = useParams()
  const {page, size, refresh, moveToModify, moveToList} = useCustomMove()
  const [serverData, setServerData] = useState(initState)
  const [supplier, setSupplier] = useState(initSupplier)

  const handleClickRemove = async () => {
    try {
      await removeOne(productId).then(() => {
        moveToList()
      })
    } catch (error) {
      console.error("There was an error with the request:", error)
    }
  }

  useEffect(() => {
    getOne(productId).then(data => {
      setServerData(data)
      console.log(data)
    })
  }, [page, size, refresh])

  useEffect(() => {
    if(serverData.supplierId){
      getSupplierOne(serverData.supplierId).then(data => {
        console.log(data)
        setSupplier(data)
      })
    }
  }, [serverData])

  return (
    <div>
      <Card
        style={{
          width: '100%'
        }}
      >
        <CardHeader>
          <CardTitle tag={"h3"}>
            {serverData.name}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ListGroup flush>
            <ListGroupItem>
              <ListGroupItemHeading className='font-weight-bold'>
                価額
              </ListGroupItemHeading>
              <ListGroupItemText>
                {serverData.price}円
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading className='font-weight-bold'>
                在庫
              </ListGroupItemHeading>
              <ListGroupItemText>
                {serverData.quantity}
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading className='font-weight-bold'>
                商品の説明
              </ListGroupItemHeading>
              <ListGroupItemText>
                {serverData.description}
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
            <ListGroupItemHeading className='font-weight-bold'>
              取引先
            </ListGroupItemHeading>
              <List>
                <li>
                  会社名　：{supplier.name}
                </li>
                <li>
                  連絡先　：{supplier.tel}
                </li>
                <li>
                  メール　：{supplier.email}
                </li>
              </List>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading className='font-weight-bold'>
                商品のイメジ
              </ListGroupItemHeading>
            </ListGroupItem>
          </ListGroup>
        </CardBody>
        
        <CardBody>
          {serverData.uploadFileName?.map((image) => (
            <img style={{width: '40%'}} src={image} />
          ))}
        </CardBody>
      
        <CardBody className="d-flex justify-content-end">
          <Button onClick={() => moveToModify(serverData.productId)}>
            Edit
          </Button>
          <Button color="danger" className="ml-2" onClick={() => handleClickRemove(serverData.productId)}>
            Delete
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default DetailPage;