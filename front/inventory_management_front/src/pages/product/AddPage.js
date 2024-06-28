import React, {useState, useEffect, useRef} from 'react';
import { NumericFormat } from 'react-number-format';
import useCustomMove from '../../hooks/useCustomMove';
import useCustomInput from '../../hooks/useCustomInput';
import { postAdd } from '../../api/productApi';
import { getAllList } from '../../api/supplierApi';
import { 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  FormText, 
  Button, 
  FormFeedback 
} from "reactstrap";

const initProduct = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  supplierId: null
}

const AddPage = () => {
  const {moveToList} = useCustomMove()
  const {inputData, resetInput, handleChangeInput} = useCustomInput(initProduct)

  const uploadRef = useRef(null);

  const [supplier, setSupplier] = useState(null)
  const [productResult, setProductResult] = useState(null)
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    price: false,
    supplierId: false,
    files: false
  });

  const handlePriceChange = (values) => {
    const { value } = values;
    handleChangeInput({
      target: {
        name: 'price',
        value: value // 이 부분이 변경되어야 한다.
      }
    });
  }

  const handleClickAdd = async () => {
    const formData = new FormData()

    const images = uploadRef.current.files

    for(let i = 0; i < images.length; i++){
      formData.append("files", images[i])
    }

    formData.append("name", inputData.name)
    formData.append("description", inputData.description)
    formData.append("price", inputData.price)
    formData.append("quantity", inputData.quantity)
    formData.append("supplierId", inputData.supplierId)

    // 입력 필드의 유효성 검사
    const newErrors = {
      name: !inputData.name,
      description: !inputData.description,
      price: inputData.price <= 0,
      supplierId: !inputData.supplierId,
      files: images.length === 0
    }

    if(Object.values(newErrors).some(error => error)){
      setErrors(newErrors)
      alert("すべての必須フィールドに入力してください。")
      return
    }

    try {
      const data = await postAdd(formData);
      setProductResult({ ...data });
    } catch (error) {
      console.error("There was an error with the request:", error);
    }
  }

  useEffect(() => {
    getAllList().then(data => {
      setSupplier(data)
      console.log(data)
    })
  },[])

  useEffect(() => {
    if (productResult) {
      moveToList();
      setProductResult(null);
      resetInput(initProduct)
      if (uploadRef.current) {
        uploadRef.current.value = '';
      }
    }
  }, [productResult, moveToList]);

  useEffect(() => {
    console.log(inputData)
  }, [inputData])

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
              invalid={errors.name}
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
              invalid={errors.description}
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
            <NumericFormat
              id="price"
              name="price"
              placeholder="商品の価額"
              value={inputData.price}
              onValueChange={handlePriceChange}
              invalid={errors.price}
              thousandSeparator={true}
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
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
              onChange={handleChangeInput}
              defaultValue={inputData.supplierId}
              invalid={errors.supplierId}
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
            <Input
              innerRef={uploadRef}
              multiple={true}
              id="ProductImage"
              name="files"
              type="file"
              accept='image/*'
              invalid={errors.files}
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
            <Button onClick={moveToList} className='font-weight-bold' color="danger">
              戻る
            </Button>
            <Button onClick={handleClickAdd} className='font-weight-bold ml-2'>
              追加
            </Button>
          </FormGroup>
        </Form>
    </div>
  );
};

export default AddPage;