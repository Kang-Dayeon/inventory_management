import React, { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { getOne } from '../../api/productApi';
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
  imageList: [],
  quantity: 0,
  supplier: '',
  createAt: ''
}

const DetailPage = () => {
  const {productId} = useParams()
  const {page, size, refresh, moveToModify} = useCustomMove()
  const [serverData, setServerData] = useState(initState)

  console.log(productId)

  useEffect(() => {
    getOne(productId).then(data => {
      setServerData(data)
      console.log(data)
    })
  }, [page, size, refresh])

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
              取引先：{serverData.supplier.name}
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
          {serverData.imageList.map((image) => (
            <img style={{width: '40%'}} src={image} />
          ))}
        </CardBody>
      
        <CardBody className="d-flex justify-content-end">
          <Button onClick={() => moveToModify(serverData.productId)}>
            Edit
          </Button>
          <Button color="danger" className="ml-2">
            Delete
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default DetailPage;