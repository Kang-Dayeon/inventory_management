import { Cookies } from "react-cookie";

const cookies = new Cookies()

export const setCookie = (name, value, days = 1) => {
  const expries = new Date()
  expries.setUTCDate(expries.getUTCDate() + days)

  return cookies.set(name, value, {expires: expries, path: '/'})
}

export const getCookie = (name) => {
  return cookies.get(name)
}

export const removeCookie = (name, path = '/') => {
  cookies.remove(name, {path:path})
}