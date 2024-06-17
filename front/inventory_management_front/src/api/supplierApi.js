import axios from "axios";
import {API_SERVER_HOST} from "./productApi"

const prefix = `${API_SERVER_HOST}/api/supplier`

export const getList = async (pageParam) => {
  const {page, size} = pageParam

  const res = await axios.get(`${prefix}/`, {params:{page,size}})

  return res.data
}

export const getOne = async (supplierId) => {
  const res = await axios.get(`${prefix}/${supplierId}`)

  return res.data
}

export const getNameList = async () => {
  const res = await axios.get(`${prefix}/names`)

  return res.data
}

export const postAdd = async (supplier) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}

  const res = await axios.post(`${prefix}/add`, supplier, header)

  return res.data
}