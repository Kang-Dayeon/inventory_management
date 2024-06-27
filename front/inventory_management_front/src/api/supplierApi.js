import {API_SERVER_HOST} from "./productApi"
import jwtAxios from "../util/jwtUtil";

const prefix = `${API_SERVER_HOST}/api/supplier`

export const getList = async (pageParam) => {
  const {page, size} = pageParam

  const res = await jwtAxios.get(`${prefix}/`, {params:{page,size}})

  return res.data
}

export const getSupplierOne = async (supplierId) => {
  const res = await jwtAxios.get(`${prefix}/${supplierId}`)

  return res.data
}

export const getAllList = async () => {
  const res = await jwtAxios.get(`${prefix}/list`)

  return res.data
}

export const postAdd = async (supplier) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}
  const res = await jwtAxios.post(`${prefix}/add`, supplier, header)

  return res.data
}

export const putOne = async (productId, supplier) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}
  const res = await jwtAxios.put(`${prefix}/${productId}`, supplier, header)

  return res.data
}

export const removeOne = async (supplierId) => {
  const res = await jwtAxios.delete(`${prefix}/${supplierId}`)

  return res.data
}