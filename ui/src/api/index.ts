import axios from 'axios'

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_HOST,
	timeout: 60000,
})

export default apiClient
