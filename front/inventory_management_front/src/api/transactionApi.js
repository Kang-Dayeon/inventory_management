import axios from "axios";
import {API_SERVER_HOST} from "./productApi"

const prefix = `${API_SERVER_HOST}/api/transaction`

export const postAdd = async (productId, transaction) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}
  const res = await axios.post(`${prefix}/${productId}`, transaction, header)

  return res.data
}

export const getList = async (pageParam) => {
  const {page, size} = pageParam

  const res = await axios.get(`${prefix}/`, {params:{page,size}})

  return res.data
}