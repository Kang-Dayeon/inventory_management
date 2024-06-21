import React, { useState } from 'react';

const useCustomInput = (defalutValue) => {
  const [inputData, setInputData] = useState(defalutValue)

  const handleChangeInput = (e) => {
    const {value, name} = e.target

    console.log(name, value)

    setInputData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    console.log(inputData)
  }


  const resetInput = (defalutValue) => {
    setInputData(defalutValue)
  }

  return {inputData, resetInput, handleChangeInput}
};

export default useCustomInput;