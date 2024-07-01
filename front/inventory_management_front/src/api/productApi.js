import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = 'http://35.77.83.111:8080'

const prefix = `${API_SERVER_HOST}/api/product`

export const getTotalProduct = async () => {
  const res = await jwtAxios.get(`${prefix}/total`)

  return res.data
}

export const getAllList = async () => {
  const res = await jwtAxios.get(`${prefix}/all`)

  return res.data
}

export const getList = async (pageParam) => {
  const {page, size} = pageParam

  const res = await jwtAxios.get(`${prefix}/`, {params:{page,size}})

  return res.data
}

export const getSearchList = async (pageParam) => {
  const {page, size, productName} = pageParam

  const res = await jwtAxios.get(`${prefix}/search`, {params:{page, size, productName}})
  
  return res.data
}

export const getOne = async (productId) => {
  const res = await jwtAxios.get(`${prefix}/${productId}`)

  return res.data
}

export const postAdd = async (product) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}

  const res = await jwtAxios.post(`${prefix}/add`, product, header)

  return res.data
}

export const putOne = async (productId, product) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}

  const res = await jwtAxios.put(`${prefix}/${productId}`, product, header)

  return res.data
}

export const removeOne = async (productId) => {
  const res = await jwtAxios.delete(`${prefix}/${productId}`)

  return res.data
}
