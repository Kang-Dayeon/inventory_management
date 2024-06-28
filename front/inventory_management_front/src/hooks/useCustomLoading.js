import { useDispatch, useSelector } from "react-redux"
import { loadingEnd, loadingStart } from "../store/slices/loadingSlice"

const useCustomLoading = () => {
  const isLoading = useSelector(state => state.loadingSlice.isLoading)
  const dispatch = useDispatch()

  const doLoading = () => {
    console.log(isLoading)
    dispatch(loadingStart())
  }
  const notLoading = () => {
    console.log(isLoading)
    dispatch(loadingEnd())
  }

  return {isLoading, doLoading, notLoading}
}

export default useCustomLoading