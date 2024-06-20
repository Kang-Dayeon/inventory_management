import React, { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { getOne, removeOne } from '../../api/productApi';
import { getSupplierOne } from '../../api/supplierApi';
import { 
  Card, 
  CardBody, 
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
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
  }, [])

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
              価額：{serverData.price}円
            </ListGroupItem>
            <ListGroupItem>
              在庫：{serverData.quantity}
            </ListGroupItem>
            <ListGroupItem>
              取引先：{supplier.name}
            </ListGroupItem>
            <ListGroupItem>
              商品の説明：{serverData.description}
            </ListGroupItem>
            <ListGroupItem>
              商品のイメジ
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