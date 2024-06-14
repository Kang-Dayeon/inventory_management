import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { getList, postAdd } from '../api/productApi';
import useCustomMove from '../hooks/useCustomMove';
import MainLayout from '../layouts/MainLayout';
import PaginationComponent from '../components/common/PaginationComponent';
import { 
  Table, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  FormText, 
  Button, 
  FormFeedback 
} from "reactstrap";
import useCustomInput from '../hooks/useCustomInput';

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

const initProduct = {
  name: '',
  description: '',
  price: 0,
  quantity: 0
}

const Product = () => {
  const {page, size, refresh, moveToList, moveToRead} = useCustomMove()
  const {inputData, resetInput, handleChangeInput} = useCustomInput(initProduct)
  const [serverData, setServerData] = useState(initState)
  const [productResult, setProductResult] = useState(null)
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    price: false,
    images: false
  });

  const uploadRef = useRef(null);

  const handleClickAdd = async () => {
    const formData = new FormData()

    const images = uploadRef.current.files

    for(let i = 0; i < images.length; i++){
      formData.append("images", images[i])
    }

    formData.append("name", inputData.name)
    formData.append("description", inputData.description)
    formData.append("price", inputData.price)
    formData.append("quantity", inputData.quantity)

    // 입력 필드의 유효성 검사
    if (!inputData.name || !inputData.description || inputData.price === 0 || !images) {
      setErrors({
        name: !inputData.name,
        description: !inputData.description,
        price: inputData.price === 0,
        images: images
      });
      alert("Please fill out all required fields.")
      return;
    }

    try {
      const data = await postAdd(formData);
      setProductResult({ ...data });
    } catch (error) {
      console.error("There was an error with the request:", error);
    }
  }
  
  useEffect(() => {
    getList({page, size}).then(data => {
      setServerData(data)
    })
  }, [page, size, refresh])

  useEffect(() => {
    if (productResult) {
      moveToList('product');
      setProductResult(null);
      resetInput(initProduct)
      if (uploadRef.current) {
        uploadRef.current.value = '';
      }
    }
  }, [productResult, moveToList]);

  return (
    <MainLayout>
      <div className='mb-5'>
        <h3 className='font-weight-bold'>Product ADD</h3>
        <Form className='bg-white p-4 rounded shadow-md'>
          <FormGroup>
            <Label for="name" className='font-weight-bold'>
              Product Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Product Name"
              type="text"
              value={inputData.name}
              onChange={handleChangeInput}
              invalid={errors.name}
            />
            {errors.name && (
              <FormFeedback>
                Please write product name
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="description" className='font-weight-bold'>
              Product Description
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="Product Description"
              type="textarea"
              value={inputData.description}
              onChange={handleChangeInput}
              invalid={errors.description}
            />
            {errors.description && (
              <FormFeedback>
                Please write product description
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="price" className='font-weight-bold'>
              Product Price
            </Label>
            <Input
              id="price"
              name="price"
              placeholder="ProductPrice"
              type="number"
              value={inputData.price}
              onChange={handleChangeInput}
              invalid={errors.price}
            />
            {errors.price && (
              <FormFeedback>
                Please write product price
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="quantity" className='font-weight-bold'>
              Quantity
            </Label>
            <Input
              id="quantity"
              name="quantity"
              placeholder="quantity"
              type="number"
              value={inputData.quantity}
              onChange={handleChangeInput}
            />
          </FormGroup>

          <FormGroup>
            <Label for="ProductImage" className='font-weight-bold'>
              Product Image
            </Label>
            <Input
              innerRef={uploadRef}
              multiple={true}
              id="ProductImage"
              name="ProductImage"
              type="file"
              accept='image/*'
              invalid={errors.images}
            />
            {errors.images && (
              <FormFeedback>
                Please add product image
              </FormFeedback>
            )}
            <FormText>
              This is some placeholder block-level help text for the above input. It‘s a bit lighter and easily wraps to a new line.
            </FormText>
          </FormGroup>
          
          <FormGroup className='d-flex justify-content-end'>
            <Button onClick={handleClickAdd} className='font-weight-bold'>
              ADD
            </Button>
          </FormGroup>
        </Form>
      </div>
      
      <div>
        <h3 className='font-weight-bold'>Product List</h3>
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
                Description
              </th>
              <th>
                Price
              </th>
              <th>
                Quantity
              </th>
              <th>
                Supplier
              </th>
              <th>
                Create Date
              </th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.map((product) => 
                <tr>
                <th scope="row">
                  {product.id}
                </th>
                <td>
                  {product.name}
                </td>
                <td>
                  {product.description}
                </td>
                <td>
                  {product.price}
                </td>
                <td>
                  {product.quantity}
                </td>
                <td>
                  거래처
                  {/* {product.supplier} */}
                </td>
                <td>
                  {moment(product.createdAt).format('YYYY.MM.DD')}
                </td>
                </tr>
              )}
          </tbody>
        </Table>

        <PaginationComponent serverData={serverData} moveToPage={moveToList} pageName={"product"} />
      </div>
      
    </MainLayout>
  );
};

export default Product;