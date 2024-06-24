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

const initProduct = {
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
  const [product, setProduct] = useState(initProduct)
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
      setProduct(data)
    })
  }, [page, size, refresh])

  useEffect(() => {
    if(product.supplierId){
      getSupplierOne(product.supplierId).then(data => {
        setSupplier(data)
      })
    }
  }, [product])

  return (
    <div>
      <Card
        style={{
          width: '100%'
        }}
      >
        <CardHeader>
          <CardTitle tag={"h3"}>
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ListGroup flush>
            <ListGroupItem>
              <ListGroupItemHeading className='font-weight-bold'>
                価額
              </ListGroupItemHeading>
              <ListGroupItemText>
                {product.price}円
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading className='font-weight-bold'>
                在庫
              </ListGroupItemHeading>
              <ListGroupItemText>
                {product.quantity}
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading className='font-weight-bold'>
                商品の説明
              </ListGroupItemHeading>
              <ListGroupItemText>
                {product.description}
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
            <ListGroupItemHeading className='font-weight-bold'>
              取引先
            </ListGroupItemHeading>
              <List>
                <li>
                  会名　：{supplier.name}
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
                商品のイメージ
              </ListGroupItemHeading>
            </ListGroupItem>
          </ListGroup>
        </CardBody>
        
        <CardBody>
          {product.uploadFileName?.map((image) => (
            <img style={{width: '40%'}} src={image} />
          ))}
        </CardBody>
      
        <CardBody className="d-flex justify-content-end">
          <Button onClick={() => moveToModify(product.productId)}>
            修正
          </Button>
          <Button color="danger" className="ml-2" onClick={() => handleClickRemove(product.productId)}>
            削除
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default DetailPage;