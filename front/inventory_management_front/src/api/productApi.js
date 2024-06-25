import axios from "axios";

export const API_SERVER_HOST = 'http://localhost:8080'

const prefix = `${API_SERVER_HOST}/api/product`

export const getAllList = async () => {
  const res = await axios.get(`${prefix}/all`)

  return res.data
}

export const getList = async (pageParam) => {
  const {page, size} = pageParam

  const res = await axios.get(`${prefix}/`, {params:{page,size}})

  return res.data
}

export const getSearchList = async (pageParam) => {
  const {page, size, productName} = pageParam

  const res = await axios.get(`${prefix}/search`, {params:{page, size, productName}})
  
  return res.data
}

export const getOne = async (productId) => {
  const res = await axios.get(`${prefix}/${productId}`)

  return res.data
}

export const postAdd = async (product) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}

  const res = await axios.post(`${prefix}/add`, product, header)

  return res.data
}

export const putOne = async (productId, product) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}

  const res = await axios.put(`${prefix}/${productId}`, product, header)

  return res.data
}

export const removeOne = async (productId) => {
  const res = await axios.delete(`${prefix}/${productId}`)

  return res.data
}
