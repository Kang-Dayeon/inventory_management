import {API_SERVER_HOST} from "./productApi"
import jwtAxios from "../util/jwtUtil";

const prefix = `${API_SERVER_HOST}/api/reports`

export const getReport = async (pageParam) => {
  const {productId, startDate, endDate} = pageParam

  const res = await jwtAxios.get(`${prefix}/sales`, {params:{productId, startDate, endDate}})
  
  return res.data
}