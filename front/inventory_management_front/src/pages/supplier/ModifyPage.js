import React, {useState, useEffect} from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { getSupplierOne, putOne } from '../../api/supplierApi';
import { 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
  FormFeedback 
} from "reactstrap";
import useCustomInput from '../../hooks/useCustomInput';
import { useParams } from 'react-router-dom';

const initSupplier = {
  name: '',
  tel: '',
  email: ''
}

const ModifyPage = () => {
  const {supplierId} = useParams()
  const {moveToList} = useCustomMove()

  const [supplier, setSupplier] = useState(initSupplier)
  const {inputData, resetInput, handleChangeInput} = useCustomInput(supplier)

  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({
    name: false,
    tel: false,
    email: false
  });

  const handleClickAdd = async () => {
    // 입력 필드의 유효성 검사
    if (!inputData.name || !inputData.tel || !inputData.email) {
      setErrors({
        name: !inputData.name,
        tel: !inputData.tel,
        email: !inputData.email,
      });
      alert("すべての必須フィールドに入力してください。")
      return;
    }

    try {
      const data = await putOne(supplier.supplierId, inputData);
      setResult({ ...data });
    } catch (error) {
      console.error("There was an error with the request:", error);
    }
  }

  useEffect(() => {
    getSupplierOne(supplierId).then((data) => {
      setSupplier(data)
      resetInput(data)
    })
  }, [])

  useEffect(() => {
    if (result) {
      moveToList();
      setResult(null);
      resetInput(initSupplier)
    }
  }, [result, moveToList]);

  return (
    <div className='mb-5'>
      <h3 className='font-weight-bold'>Supplier Modify</h3>
        <Form className='bg-white p-4 rounded shadow-md'>
          <FormGroup>
            <Label for="name" className='font-weight-bold'>
              社名
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Supplier Name"
              type="text"
              value={inputData.name}
              onChange={handleChangeInput}
              invalid={errors.name}
            />
            {errors.name && (
              <FormFeedback>
                取引先の名を書いて下さい。
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="tel" className='font-weight-bold'>
              取引先の電話番号
            </Label>
            <Input
              id="tel"
              name="tel"
              placeholder="Supplier Tel"
              type="text"
              value={inputData.tel}
              onChange={handleChangeInput}
              invalid={errors.tel}
            />
            {errors.tel && (
              <FormFeedback>
                取引先の電話番号を書いて下さい。
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="email" className='font-weight-bold'>
              取引先のメール
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="exemple@mail.com"
              type="email"
              value={inputData.email}
              onChange={handleChangeInput}
              invalid={errors.email}
            />
            {errors.email && (
              <FormFeedback>
                取引先のメールを書いて下さい。
              </FormFeedback>
            )}
          </FormGroup>
          
          <FormGroup className='d-flex justify-content-end'>
            <Button onClick={handleClickAdd} className='font-weight-bold'>
              修正
            </Button>
          </FormGroup>
        </Form>
    </div>
  );
};

export default ModifyPage;