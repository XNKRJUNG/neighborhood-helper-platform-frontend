// src/srvices/api.ts
import axios from "axios"
import { store } from "@/store"

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Base URL to the backend
  headers: {
    "Content-Type": "application/json"
  }
})

// Automatically attach token from Redux store to every request
// Request Interceptor
api.interceptors.request.use(
  config => {
    const token = store.getState().auth.token
    if (token) {
      config.headers.Authorization = "Bearer ${token}"
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response Interceptor - Can catch 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Todo: Optionally handle logout automatically if token expired
      console.error("Unauthorized, loging out...")
    }
    return Promise.reject(error)
  }
)

export default api
