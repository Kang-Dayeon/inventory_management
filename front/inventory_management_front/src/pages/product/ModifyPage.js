import React, { useState, useRef, useEffect } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import useCustomInput from '../../hooks/useCustomInput';
import { putOne, getOne } from '../../api/productApi';
import { getAllList } from '../../api/supplierApi';
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

const ModifyPage = () => {
  const {productId} = useParams()
  const {moveToList} = useCustomMove()
  const uploadRef = useRef(null);

  const [product, setProduct] = useState(initProduct)
  const {inputData, resetInput, handleChangeInput} = useCustomInput(product)

  const [supplier, setSupplier] = useState(null)
  const [productResult, setProductResult] = useState(null)
  const [errors, setErrors] = useState({});

  const deleteOldImage = (imageName) => {
    const resultImageNames = product.uploadFileName.filter((image) => image !== imageName)
    product.uploadFileName = resultImageNames
    setProduct({...product})
  }

  const handleClickAdd = async () => {
    const formData = new FormData()
    const images = uploadRef.current.files

    for(let i = 0; i < images.length; i++){
      formData.append("files", images[i])
    }

    for(let i = 0; i < product.uploadFileName.length; i++){
      formData.append("uploadFileName", product.uploadFileName[i])
    }
    
    formData.append("name", inputData.name)
    formData.append("description", inputData.description)
    formData.append("price", inputData.price)
    formData.append("quantity", inputData.quantity)
    formData.append("supplierId", inputData.supplierId)

    // 입력 필드의 유효성 검사
    const newErrors = {}
    if (!inputData.name) newErrors.name = true
    if (!inputData.description) newErrors.description = true
    if (inputData.price === 0) newErrors.price = true
    if (inputData.uploadFileName.length === 0 && images.length === 0) newErrors.files = true
    if (!inputData.supplierId) newErrors.supplierId = true

    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      alert("すべての必須フィールドに入力してください。")
      return;
    }

    try {
      const data = await putOne(productId, formData)
      setProductResult({ ...data })
    } catch (error) {
      console.error("There was an error with the request:", error)
    }
  }

  useEffect(() => {
    getAllList().then(data => {
      setSupplier(data)
    })
  },[])

  useEffect(() => {
    getOne(productId).then(data => {
      setProduct(data)
      resetInput(data)
    })
  }, [productId])

  useEffect(() => {
    if (productResult) {
      moveToList()
      setProductResult(null)
      resetInput(initProduct)
      if (uploadRef.current) {
        uploadRef.current.value = '';
      }
    }
  }, [productResult, moveToList, resetInput]);

  return (
    <div className='mb-5'>
      <h3 className='font-weight-bold'>商品追加</h3>
        <Form className='bg-white p-4 rounded shadow-md'>
          <FormGroup>
            <Label for="name" className='font-weight-bold'>
              商品名
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="商品名"
              type="text"
              value={inputData.name}
              onChange={handleChangeInput}
              invalid={!!errors.name}
            />
            {errors.name && (
              <FormFeedback>
                商品名を入力して下さい。
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="description" className='font-weight-bold'>
              商品の説明
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="商品の説明"
              type="textarea"
              value={inputData.description}
              onChange={handleChangeInput}
              invalid={!!errors.description}
            />
            {errors.description && (
              <FormFeedback>
                商品の説明を入力して下さい。
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="price" className='font-weight-bold'>
              商品の価額
            </Label>
            <Input
              id="price"
              name="price"
              placeholder="商品の価額"
              type="number"
              value={inputData.price}
              onChange={handleChangeInput}
              invalid={!!errors.price}
            />
            {errors.price && (
              <FormFeedback>
                商品の価額を入力して下さい。
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="quantity" className='font-weight-bold'>
              商品の在庫
            </Label>
            <Input
              id="quantity"
              name="quantity"
              placeholder="商品の在庫"
              type="number"
              value={inputData.quantity}
              onChange={handleChangeInput}
            />
          </FormGroup>

          {supplier ? (
            <FormGroup>
            <Label for="supplier">
              取引先
            </Label>
            <Input
              id="supplier"
              name="supplierId"
              type="select"
              defaultValue={inputData.supplierId}
              onChange={handleChangeInput}
              invalid={!!errors.supplierId}
            >
              <option value="">Select</option>
              {supplier.map((supplier) => (
                <option key={supplier.supplierId} value={supplier.supplierId}>{supplier.name}</option>
              ))}
            </Input>
            {errors.supplierId && (
              <FormFeedback>
                取引先を選んで下さい。
              </FormFeedback>
            )}
          </FormGroup>
          ) : null}

          <FormGroup>
            <Label for="ProductImage" className='font-weight-bold'>
              商品のイメージ
            </Label>
            <div className="d-flex">
            {product.uploadFileName.map(image => (
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
                    削除
                  </Button>
                </CardBody>
              </Card>
            ))}
            </div>
            
            <Input
              innerRef={uploadRef}
              multiple={true}
              id="ProductImage"
              name="files"
              type="file"
              accept='image/*'
              invalid={!!errors.files}
            />
            {errors.files && (
              <FormFeedback>
                商品のイメージを追加して下さい。
              </FormFeedback>
            )}
            <FormText>
              This is some placeholder block-level help text for the above input. It‘s a bit lighter and easily wraps to a new line.
            </FormText>
          </FormGroup>
        
          <FormGroup className='d-flex justify-content-end'>
            <Button onClick={handleClickAdd} className='font-weight-bold'>
              追加
            </Button>
          </FormGroup>
        </Form>
    </div>
  );
};

export default ModifyPage;