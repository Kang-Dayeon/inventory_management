import axios from "axios";

export const API_SERVER_HOST = 'http://localhost:8080'

const prefix = `${API_SERVER_HOST}/api/product`

export const getList = async (pageParam) => {
  const {page, size} = pageParam

  const res = await axios.get(`${prefix}/`, {params:{page,size}})

  return res.data
}

export const postAdd = async (product) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}

  const res = await axios.post(`${prefix}/add`, product, header)

  return res.data
}
