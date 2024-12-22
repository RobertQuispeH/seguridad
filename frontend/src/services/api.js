import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000', // Cambia esto por la URL de tu backend
})

export const login = (email, password) => {
  console.log(email)
  console.log(password)
  return api.post('/login', { email, password })
}

export const verifyOtp = (userId, otpCode) => {
  return api.post('/verify-otp', { user_id: userId, otp_code: otpCode })
}

export const register = (username, email, password) => {
  return api.post('/register', { username, email, password })
}

export const getUsers = () => {
  // Obtener el token JWT del localStorage o sessionStorage
  const token = localStorage.getItem('authToken') // O usa sessionStorage si el token está allí
  console.log(token)
  return api.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`, // Añadir el token en la cabecera
    },
  })
}
