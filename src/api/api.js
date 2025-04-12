import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export const signup = async userData => {
  try {
    const response = await api.post('/auth/signup', userData)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const login = async credentials => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const getCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const addCategory = async categoryData => {
  try {
    const response = await api.post('/categories', categoryData)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const editCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/categories/${categoryId}`, categoryData)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export const deleteCategory = async categoryId => {
  try {
    const response = await api.delete(`/categories/${categoryId}`)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export default api
