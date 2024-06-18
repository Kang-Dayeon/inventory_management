import React, { useState, useRef, useEffect } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import useCustomInput from '../../hooks/useCustomInput';
import { putOne, getOne } from '../../api/productApi';
import { 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  FormText, 
  Button, 
  FormFeedback,
  Card,
  CardBody
} from "reactstrap";
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

const ModifyPage = () => {
  const {productId} = useParams()
  const {page, size, refresh, moveToList} = useCustomMove()
  const [serverData, setServerData] = useState(initState)
  const {inputData, resetInput, handleChangeInput} = useCustomInput(serverData)

  const uploadRef = useRef(null);
  const [supplier, setSupplier] = useState(null)
  const [productResult, setProductResult] = useState(null)
  const [errors, setErrors] = useState({
    name: serverData.name,
    description: serverData.description,
    price: serverData.price,
    images: serverData.imageList.length > 0
  });

  const deleteOldImage = (imageName) => {
    const resultImageNames = serverData.imageList.filter((image) => image !== imageName)
    serverData.imageList = resultImageNames
    setServerData({...serverData})
  }

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
    formData.append("supplierName", inputData.supplier)

    for(let i = 0; i < serverData.imageList.length; i++){
      formData.append("uploadImageNames", serverData.imageList[i])
    }

    console.log(inputData)

    // 입력 필드의 유효성 검사
    if (!inputData.name || !inputData.description || inputData.price === 0 || inputData.imageList === 0) {
      setErrors({
        name: !inputData.name,
        description: !inputData.description,
        price: inputData.price === 0,
        images: inputData.imageList.length === 0
      });
      alert("Please fill out all required fields.")
      return;
    }

    try {
      const data = await putOne(formData);
      setProductResult({ ...data });
    } catch (error) {
      console.error("There was an error with the request:", error);
    }
  }

  useEffect(() => {
    getOne(productId).then(data => {
      setServerData(data)
      console.log(data)
    })
  }, [page, size, refresh])

  useEffect(() => {
    if (productResult) {
      moveToList();
      setProductResult(null);
      resetInput(initState)
      if (uploadRef.current) {
        uploadRef.current.value = '';
      }
    }
  }, [productResult, moveToList]);

  return (
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
              value={serverData.name}
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
              value={serverData.description}
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
              value={serverData.price}
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
              value={serverData.quantity}
              onChange={handleChangeInput}
            />
          </FormGroup>

          <FormGroup>
            <Label for="ProductImage" className='font-weight-bold'>
              Product Image
            </Label>
            {serverData.imageList.map(image => (
              <Card
                style={{
                  width: '18rem'
                }}
              >
                <img
                  src={image}
                />
                <CardBody>
                  <Button onClick={() => deleteOldImage(image)}>
                    Delete
                  </Button>
                </CardBody>
              </Card>
            ))}
            
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

          {supplier ? (
            <FormGroup>
            <Label for="supplier">
              Select
            </Label>
            <Input
              id="supplier"
              name="supplier"
              type="select"
              onChange={handleChangeInput}
              value={serverData.supplier}
            >
              <option>Select</option>
              {supplier.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Input>
          </FormGroup>
          ) : null}
        
          <FormGroup className='d-flex justify-content-end'>
            <Button onClick={handleClickAdd} className='font-weight-bold'>
              ADD
            </Button>
          </FormGroup>
        </Form>
    </div>
  );
};

export default ModifyPage;