import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../../api/authApi";
import { getCookie, removeCookie, setCookie } from "../../util/cookieUtil";

const initState =  {
  username: ''
}

const loadMemberCookie = () => {
  const memberInfo = getCookie("member")

  return memberInfo
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => loginPost(param))

const authSlice = createSlice({
  name: 'authSlice',
  initialState: loadMemberCookie() || initState,
  reducers: {
    login: (state, action) => {
      return state.username = action.payload.username
    },
    logout: () => {
      removeCookie("member")
      return {...initState}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginPostAsync.fulfilled, (state, action) => {
      const payload = action.payload

      if(!payload.error){
        setCookie("member", JSON.stringify(payload))
      }

      return payload
    })
    .addCase(loginPostAsync.pending, (state, action) => {
      console.log("pending")
    })
    .addCase(loginPostAsync.rejected, (state, action) => {
      console.log("rejected")
    })
  }
})

export const {login, logout} = authSlice.actions

export default authSlice.reducer