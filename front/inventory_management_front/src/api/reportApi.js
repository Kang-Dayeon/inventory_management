import axios from "axios";
import {API_SERVER_HOST} from "./productApi"

const prefix = `${API_SERVER_HOST}/api/reports`

export const getReport = async (pageParam) => {
  const {productId, startDate, endDate} = pageParam

  const res = await axios.get(`${prefix}/sales`, {params:{productId, startDate, endDate}})
  
  return res.data
}