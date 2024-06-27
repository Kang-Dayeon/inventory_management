import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { loginPostAsync, logout } from "../store/slices/authSlice"

const useCustomLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loginState = useSelector(state => state.authSlice)

  const isLogin = loginState.username ? true : false

  const doLogin = async (loginParam) => {

    const action = await dispatch(loginPostAsync(loginParam))

    return action.payload
  }

  const doLogout = () => {
    dispatch(logout())
  }

  const moveToPath = (path) => {
    navigate({pathname: path}, {replace: true})
  }

  const moveToLogin = () => {
    navigate({pathname: '/login'}, {replace: true})
  }

  const moveToLoginReturn = () => {
    return <Navigate replace to={"/login"}></Navigate>
  }

  return {loginState, isLogin, doLogin, doLogout, moveToLogin, moveToPath, moveToLoginReturn}
}

export default useCustomLogin