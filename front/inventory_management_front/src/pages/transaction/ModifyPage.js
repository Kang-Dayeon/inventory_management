import React, { useState, useEffect } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { getOne } from '../../api/productApi';
import { getOneTransaction, putOne } from '../../api/transactionApi';
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
  Button,
  Form, 
  FormGroup, 
  Label, 
  Input, 
  FormFeedback,
} from "reactstrap";
import { useParams } from 'react-router-dom';

const initProduct = {
  name: '',
  description: '',
  price: 0,
  files: [],
  uploadFileName: [],
  quantity: 0,
  supplierId: null,
  createAt: ''
}

const initTransaction = {
  totalPrice: 0,
  quantity: 0
}

const initSupplier = {
  name: '',
  tel: '',
  email: ''
}

const ModifyPage = () => {
  const {transactionId} = useParams()
  const {moveToList} = useCustomMove()
  const [product, setProduct] = useState(initProduct)
  const [transaction, setTransaction] = useState(initTransaction)
  const [supplier, setSupplier] = useState(initSupplier)
  const [formattedTotalPrice, setFormattedTotalPrice] = useState('')

  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState(false);

  const handleChangeInput = (e) => {
    const {value} = e.target
    const totalPrice = product.price * value
    setTransaction((prevData) => ({
      ...prevData,
      totalPrice: totalPrice,
      quantity: value
    }))

    setFormattedTotalPrice(totalPrice.toLocaleString())
  }

  const handleClickAdd = async () => {
    // 입력 필드의 유효성 검사
    if (transaction.quantity === 0 || transaction.quantity > product.quantity) setErrors(true)

    if(errors){
      alert("すべての必須フィールドに入力してください。")
      return;
    }

    try {
      const data = await putOne(transactionId, transaction)
      setResult({ ...data })
    } catch (error) {
      console.error("There was an error with the request:", error)
    }
  }

  useEffect(() => {
    if(transaction.productId){
      getOne(transaction.productId).then(data => {
        setProduct(data)
      })
    }
  }, [transaction])

  useEffect(() => {
    if(product.supplierId){
      getSupplierOne(product.supplierId).then(data => {
        setSupplier(data)
      })
    }
  }, [product])

  useEffect(() => {
    getOneTransaction(transactionId).then(data => {
      setTransaction(data)
      setFormattedTotalPrice(data.totalPrice.toLocaleString())
    })
  }, [])

  useEffect(() => {
    if (result) {
      moveToList()
      setResult(null)
      setTransaction(initTransaction)
    }
  }, [result, moveToList]);

  return (
    <div className='mb-5'>
      <h3 className='font-weight-bold'>取引追加</h3>
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
        </Card>


        <Form className='bg-white p-4 rounded shadow-md'>
          <FormGroup>
            <Label for="price" className='font-weight-bold'>
              取引金額
            </Label>
            <Input
              id="totalPrice"
              name="totalPrice"
              placeholder="取引金額"
              type="text"
              value={formattedTotalPrice}
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label for="quantity" className='font-weight-bold'>
              取引数量
            </Label>
            <Input
              id="quantity"
              name="quantity"
              placeholder="取引数量"
              type="number"
              value={transaction.quantity}
              onChange={handleChangeInput}
            />
            {errors.quantity && (
              <FormFeedback>
                取引数量を入力して下さい。
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup className='d-flex justify-content-end'>
            <Button onClick={handleClickAdd} className='font-weight-bold'>
              戻る
            </Button>
            <Button onClick={handleClickAdd} className='font-weight-bold'>
              追加
            </Button>
          </FormGroup>
        </Form>
    </div>
  );
};

export default ModifyPage;