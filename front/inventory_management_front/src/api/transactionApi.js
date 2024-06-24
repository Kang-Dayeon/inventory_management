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

export const getOneTransaction = async (transactionId) => {
  const res = await axios.get(`${prefix}/${transactionId}`)

  return res.data
}

export const putOne = async (transactionId, transaction) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}
  const res = await axios.put(`${prefix}/${transactionId}`, transaction, header)

  return res.data
}

export const removeOne = async (transactionId) => {
  const res = await axios.delete(`${prefix}/${transactionId}`)

  return res.data
}

export const getSearchList = async (pageParam) => {
  const {page, size, productId, dateRange} = pageParam
  const res = await axios.get(`${prefix}/search`, {params:{page, size, productId, dateRange}})

  return res.data
}