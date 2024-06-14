import React, { useState } from 'react';

const useCustomInput = (defalutValue) => {
  const [inputData, setInputData] = useState(defalutValue)

  const handleChangeInput = (e) => {
    const {value, name} = e.target

    setInputData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const resetInput = (defalutValue) => {
    setInputData(defalutValue)
  }

  return {inputData, resetInput, handleChangeInput}
};

export default useCustomInput;