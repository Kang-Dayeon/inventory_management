import axios from "axios";

export const API_SERVER_HOST = 'http://localhost:8080'

const prefix = `${API_SERVER_HOST}/api/product`

export const getList = async (pageParam) => {
  const {page, size} = pageParam

  const res = await axios.get(`${prefix}/`, {params:{page,size}})

  return res.data
}
