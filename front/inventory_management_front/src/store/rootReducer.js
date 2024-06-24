import {combineReducers} from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key: "root",
  storage,
  whitelist: [""]
}

export const rootReducer = combineReducers({
})

export const persistedReducer =  persistReducer(persistConfig, rootReducer)