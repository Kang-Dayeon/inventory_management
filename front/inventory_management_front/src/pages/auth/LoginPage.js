import React from 'react';
import { 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartFlatbed
} from "@fortawesome/free-solid-svg-icons";
import useCustomInput from '../../hooks/useCustomInput';
import useCustomLogin from '../../hooks/useCustomLogin';

const initMember = {
  username: '',
  password: ''
}

const LoginPage = () => {
  const {inputData, handleChangeInput} = useCustomInput(initMember)

  const {doLogin, moveToPath} = useCustomLogin()

  const handleClickLogin = () => {
    doLogin(inputData).then(data => {
      if(data.error){
        alert("Check your ID and Password")
      } else {
        moveToPath("/")
      }
    })
  }

  return (
    <div className='d-flex justify-content-center container-fluid' style={{height: "100vh"}}>
      <div className='auth-wrapper'>
        <div className='auth-title-icon'>
          <FontAwesomeIcon icon={faCartFlatbed} />
        </div>
        <h2 className='auth-title'>Inventory Management</h2>
        <div className='auth-form'>
          <Form className='text-center'>
            <FormGroup>
              <Label
                for="username"
                hidden
              >
                ID
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="ID"
                type="text"
                value={inputData.username}
                onChange={handleChangeInput}
              />
            </FormGroup>
            {' '}
            <FormGroup>
              <Label
                for="password"
                hidden
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                value={inputData.password}
                onChange={handleChangeInput}
              />
            </FormGroup>
            {' '}
            <Button onClick={handleClickLogin}>
              LOGIN
            </Button>
          </Form>
        </div>
      </div>
      
    </div>
  );
};

export default LoginPage;