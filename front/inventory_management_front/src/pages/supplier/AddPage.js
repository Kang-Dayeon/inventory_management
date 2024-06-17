import React, {useState, useEffect} from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import { postAdd } from '../../api/supplierApi';
import { 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
  FormFeedback 
} from "reactstrap";
import useCustomInput from '../../hooks/useCustomInput';

const initState = {
  name: '',
  tell: '',
  email: ''
}

const AddPage = () => {
  const {moveToList} = useCustomMove()
  const {inputData, resetInput, handleChangeInput} = useCustomInput(initState)

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
      alert("Please fill out all required fields.")
      return;
    }

    try {
      const data = await postAdd(inputData);
      setResult({ ...data });
    } catch (error) {
      console.error("There was an error with the request:", error);
    }
  }

  useEffect(() => {
    if (result) {
      moveToList();
      setResult(null);
      resetInput(initState)
    }
  }, [result, moveToList]);

  return (
    <div className='mb-5'>
      <h3 className='font-weight-bold'>Supplier ADD</h3>
        <Form className='bg-white p-4 rounded shadow-md'>
          <FormGroup>
            <Label for="name" className='font-weight-bold'>
              Supplier Name
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
                Please write Supplier name
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="tel" className='font-weight-bold'>
              Supplier Tel
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
                Please write supplier tel
              </FormFeedback>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="email" className='font-weight-bold'>
              Supplier Email
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
                Please write supplier email
              </FormFeedback>
            )}
          </FormGroup>
          
          <FormGroup className='d-flex justify-content-end'>
            <Button onClick={handleClickAdd} className='font-weight-bold'>
              ADD
            </Button>
          </FormGroup>
        </Form>
    </div>
  );
};

export default AddPage;